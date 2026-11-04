import { Component, Input, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../../services/firebase/firebase-service';
import { ModalService } from '../../services/modal-service/modal-service';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';
import { IPost, IImage } from '../../models/state.interface';

@Component({
  selector: 'app-post-editor',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './post-editor.html',
  styleUrl: './post-editor.scss',
})
export class PostEditor {
  private _firebaseService = inject(FirebaseService);
  private _fb = inject(FormBuilder);
  private _toastr = inject(ToastrService);
  private _modalService = inject(ModalService);
  private _destroyRef = inject(DestroyRef);

  @Input() public posts: IPost[] | null = [];

  public isLoading = signal(false);
  private _editForms: { [postId: string]: FormGroup } = {};

  public getEditForm(post: IPost): FormGroup {
    const postId = post.id!;
    if (!this._editForms[postId]) {
      const category = post.category || APP_KEY_VALUES.general_category;
      const isGallery = category === APP_KEY_VALUES.image_gallery_category;
      const isService = category === APP_KEY_VALUES.service_category;

      const firstService = isService && post.services && post.services.length > 0 ? post.services[0] : { name: '', description: '' };

      // Ensure all fields referenced in post-editor.html are registered here
      this._editForms[postId] = this._fb.group({
        category: [category, Validators.required],
        content: [isGallery || isService ? '' : (post.content || ''), isGallery || isService ? [] : [Validators.required]],
        page: [post.page || (isGallery ? APP_KEY_VALUES.image_gallery_category : isService ? APP_KEY_VALUES.service_category : APP_KEY_VALUES.about_page), isGallery || isService ? [] : [Validators.required]],
        serviceName: [isService ? firstService.name : ''],
        serviceDescription: [isService ? firstService.description : '']
      });

      // Dynamically handle validation and field state changes when category switches
      this._editForms[postId].get('category')?.valueChanges.pipe(
        takeUntilDestroyed(this._destroyRef)
      ).subscribe(cat => {
        const contentControl = this._editForms[postId].get('content');
        const pageControl = this._editForms[postId].get('page');
        const serviceNameControl = this._editForms[postId].get('serviceName');
        const serviceDescControl = this._editForms[postId].get('serviceDescription');

        contentControl?.clearValidators();
        pageControl?.clearValidators();
        serviceNameControl?.clearValidators();
        serviceDescControl?.clearValidators();

        if (cat === APP_KEY_VALUES.image_gallery_category) {
          contentControl?.setValue('');
          pageControl?.setValue(APP_KEY_VALUES.image_gallery_category);
        } else if (cat === APP_KEY_VALUES.service_category) {
          contentControl?.setValue('');
          pageControl?.setValue(APP_KEY_VALUES.service_category);
          serviceNameControl?.setValidators([Validators.required]);
          serviceDescControl?.setValidators([Validators.required]);
        } else {
          contentControl?.setValidators([Validators.required]);
          pageControl?.setValidators([Validators.required]);
        }

        contentControl?.updateValueAndValidity();
        pageControl?.updateValueAndValidity();
        serviceNameControl?.updateValueAndValidity();
        serviceDescControl?.updateValueAndValidity();
      });
    }
    return this._editForms[postId];
  }

  public async removeImage(post: any, imageIndex: number) {
    const imageUrlToDelete = post.images[imageIndex];
    const updatedImages = [...post.images];
    updatedImages.splice(imageIndex, 1);

    this.isLoading.set(true);
    try {
      await this._firebaseService.deleteImageFile(imageUrlToDelete);
      await this._firebaseService.updateDocument(
        APP_KEY_VALUES.posts_collection,
        post.id,
        { images: updatedImages }
      );

      post.images = updatedImages;
      this._toastr.success('Image removed successfully!', 'Success');
    } catch (error) {
      console.error('Failed to remove image:', error);
      this._toastr.error('Failed to remove image.', 'Error');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async onUpdatePost(post: any) {
    const form = this._editForms[post.id];
    if (form && form.valid) {
      this.isLoading.set(true);
      try {
        const category = form.value.category;
        const updatedData: any = {
          category: category,
          images: post.images
        };

        if (category === APP_KEY_VALUES.image_gallery_category) {
          updatedData.content = '';
          updatedData.page = APP_KEY_VALUES.image_gallery_category;
          delete updatedData.services;
        } else if (category === APP_KEY_VALUES.service_category) {
          updatedData.content = '';
          updatedData.page = APP_KEY_VALUES.service_category;
          updatedData.services = [{
            name: form.value.serviceName,
            description: form.value.serviceDescription
          }];
        } else {
          updatedData.content = form.value.content;
          updatedData.page = form.value.page;
          delete updatedData.services;
        }

        await this._firebaseService.updateDocument(
          APP_KEY_VALUES.posts_collection,
          post.id,
          updatedData
        );
        this._toastr.success('Post successfully updated!', 'Success');
      } catch (error) {
        console.error('Error updating post:', error);
        this._toastr.error('Failed to update post.', 'Error');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      form.markAllAsTouched();
    }
  }

  public onDeletePost(post: any) {
    this._modalService.openModal(
      APP_KEY_VALUES.confirmation_modal_type,
      'Delete Post',
      'Are you sure you want to delete this post? All attached images will also be deleted.',
      async () => {
        this.isLoading.set(true);
        try {
          if (post.images && post.images.length > 0) {
            const imageDeletionPromises = post.images.map((img: any) => {
              const imgUrl = typeof img === 'string' ? img : img.url;
              return imgUrl ? this._firebaseService.deleteImageFile(imgUrl) : Promise.resolve();
            });
            await Promise.all(imageDeletionPromises);
          }

          await this._firebaseService.deleteDocument(
            APP_KEY_VALUES.posts_collection,
            post.id
          );

          this._toastr.success('Post successfully deleted!', 'Success');
        } catch (error) {
          console.error('Error deleting post:', error);
          this._toastr.error('Failed to delete post.', 'Error');
        } finally {
          this.isLoading.set(false);
        }
      }
    );
  }

  public getImageUrl(img: string | IImage): string {
    return typeof img === 'string' ? img : (img.url || '');
  }

  public isImageHidden(img: string | IImage): boolean {
    return typeof img === 'object' && img !== null ? !!img.hide : false;
  }

  public async toggleImageHide(post: any, imageIndex: number, event: any) {
    const isChecked = event.target.checked;
    const updatedImages = [...post.images];
    const currentImg = updatedImages[imageIndex];

    if (typeof currentImg === 'string') {
      updatedImages[imageIndex] = {
        url: currentImg,
        hide: isChecked
      };
    } else {
      updatedImages[imageIndex] = {
        ...currentImg,
        hide: isChecked
      };
    }

    this.isLoading.set(true);
    try {
      await this._firebaseService.updateDocument(
        APP_KEY_VALUES.posts_collection,
        post.id,
        { images: updatedImages }
      );
      post.images = updatedImages;
      this._toastr.success('Image visibility updated!', 'Success');
    } catch (error) {
      console.error('Failed to update image visibility:', error);
      this._toastr.error('Failed to update image visibility.', 'Error');
    } finally {
      this.isLoading.set(false);
    }
  }
}