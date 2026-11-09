import { Component, Input, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../../services/firebase/firebase-service';
import { ModalService } from '../../services/modal-service/modal-service';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';
import { IPost, IImage } from '../../models/state.interface';

@Component({
  selector: 'app-post-editor-item',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './post-editor-item.html',
  styleUrl: './post-editor-item.scss',
})
export class PostEditorItem implements OnInit {
  private _firebaseService = inject(FirebaseService);
  private _fb = inject(FormBuilder);
  private _toastr = inject(ToastrService);
  private _modalService = inject(ModalService);
  private _destroyRef = inject(DestroyRef);

  @Input() public post!: IPost;

  public isLoading = signal(false);
  public selectedCategory = signal<string>('');
  public form!: FormGroup;
  private _selectedNewFiles: File[] = [];

  public ngOnInit() {
    const category = this.post.category || APP_KEY_VALUES.general_category;
    this.selectedCategory.set(category);
    const isGallery = category === APP_KEY_VALUES.image_gallery_category;
    const isService = category === APP_KEY_VALUES.service_category;
    const firstService = isService && this.post.services && this.post.services.length > 0 ? this.post.services[0] : { name: '', description: '' };

    this.form = this._fb.group({
      category: [category, Validators.required],
      content: [isGallery || isService ? '' : (this.post.content || ''), isGallery || isService ? [] : [Validators.required]],
      page: [this.post.page || (isGallery ? APP_KEY_VALUES.image_gallery_category : isService ? APP_KEY_VALUES.service_category : APP_KEY_VALUES.about_page), isGallery || isService ? [] : [Validators.required]],
      serviceName: [isService ? firstService.name : ''],
      serviceDescription: [isService ? firstService.description : '']
    });

    this.form.get('category')?.valueChanges.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(cat => {
      this.selectedCategory.set(cat);
      const contentControl = this.form.get('content');
      const pageControl = this.form.get('page');
      const serviceNameControl = this.form.get('serviceName');
      const serviceDescControl = this.form.get('serviceDescription');

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

  public onNewFilesSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this._selectedNewFiles = Array.from(fileList);
    }
  }

  public async removeImage(imageIndex: number) {
    const imageToDelete = this.post.images![imageIndex];
    const updatedImages = [...this.post.images!];
    updatedImages.splice(imageIndex, 1);

    this.isLoading.set(true);
    try {
      if (imageToDelete.url) {
        await this._firebaseService.deleteImageFile(imageToDelete.url);
      }
      await this._firebaseService.updateDocument(
        APP_KEY_VALUES.posts_collection,
        this.post.id!,
        { images: updatedImages }
      );
      this.post.images = updatedImages;
      this._toastr.success('Image removed successfully!', 'Success');
    } catch (error) {
      console.error('Failed to remove image:', error);
      this._toastr.error('Failed to remove image.', 'Error');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async toggleImageHide(imageIndex: number, event: any) {
    const isChecked = event.target.checked;
    const updatedImages = [...this.post.images!];
    const currentImg = updatedImages[imageIndex];

    updatedImages[imageIndex] = {
      ...currentImg,
      hide: isChecked
    };

    this.isLoading.set(true);
    try {
      await this._firebaseService.updateDocument(
        APP_KEY_VALUES.posts_collection,
        this.post.id!,
        { images: updatedImages }
      );
      this.post.images = updatedImages;
      this._toastr.success('Image visibility updated!', 'Success');
    } catch (error) {
      console.error('Failed to update image visibility:', error);
      this._toastr.error('Failed to update image visibility.', 'Error');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async onUpdatePost() {
    if (this.form.valid) {
      this.isLoading.set(true);
      try {
        const category = this.form.value.category;
        let updatedImages = [...(this.post.images || [])];

        if (this._selectedNewFiles.length > 0) {
          const uploadedNewImages = await this._firebaseService.uploadImagesDirectly(category, this._selectedNewFiles);
          updatedImages = [...updatedImages, ...uploadedNewImages];
          this._selectedNewFiles = [];
        }

        const updatedData: any = {
          category: category,
          images: updatedImages
        };

        if (category === APP_KEY_VALUES.image_gallery_category) {
          updatedData.content = '';
          updatedData.page = APP_KEY_VALUES.image_gallery_category;
          delete updatedData.services;
        } else if (category === APP_KEY_VALUES.service_category) {
          updatedData.content = '';
          updatedData.page = APP_KEY_VALUES.service_category;
          updatedData.services = [{
            name: this.form.value.serviceName,
            description: this.form.value.serviceDescription
          }];
        } else {
          updatedData.content = this.form.value.content;
          updatedData.page = this.form.value.page;
          delete updatedData.services;
        }

        await this._firebaseService.updateDocument(
          APP_KEY_VALUES.posts_collection,
          this.post.id!,
          updatedData
        );
        this.post.images = updatedImages;
        this._toastr.success('Post successfully updated!', 'Success');
      } catch (error) {
        console.error('Error updating post:', error);
        this._toastr.error('Failed to update post.', 'Error');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  public onDeletePost() {
    this._modalService.openModal(
      APP_KEY_VALUES.confirmation_modal_type,
      'Delete Post',
      'Are you sure you want to delete this post? All attached images will also be deleted.',
      async () => {
        this.isLoading.set(true);
        try {
          if (this.post.images && this.post.images.length > 0) {
            const imageDeletionPromises = this.post.images.map((img) => {
              return img.url ? this._firebaseService.deleteImageFile(img.url) : Promise.resolve();
            });
            await Promise.all(imageDeletionPromises);
          }

          await this._firebaseService.deleteDocument(
            APP_KEY_VALUES.posts_collection,
            this.post.id!
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
}