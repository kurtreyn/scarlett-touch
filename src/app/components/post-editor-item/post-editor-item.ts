import { Component, Input, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../../services/firebase/firebase-service';
import { ModalService } from '../../services/modal-service/modal-service';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';
import { IPost, IImage, IContentBlock } from '../../models/state.interface';

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

  public get sectionsFormArray(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  public get sectionsControls() {
    return this.sectionsFormArray.controls;
  }

  public addSection(title: string = '', paragraphs: string[] = []) {
    const paragraphControls = paragraphs.map(p => this._fb.control(p));
    const sectionGroup = this._fb.group({
      title: [title],
      paragraphs: this._fb.array(paragraphControls)
    });
    this.sectionsFormArray.push(sectionGroup);
  }

  public removeSection(index: number) {
    this.sectionsFormArray.removeAt(index);
  }

  public getParagraphsFormArray(sectionIndex: number): FormArray {
    return this.sectionsFormArray.at(sectionIndex).get('paragraphs') as FormArray;
  }

  public getParagraphsControls(sectionIndex: number) {
    return this.getParagraphsFormArray(sectionIndex).controls;
  }

  public addParagraphToSection(sectionIndex: number, text: string = '') {
    this.getParagraphsFormArray(sectionIndex).push(this._fb.control(text));
  }

  public removeParagraphFromSection(sectionIndex: number, paragraphIndex: number) {
    this.getParagraphsFormArray(sectionIndex).removeAt(paragraphIndex);
  }

  public ngOnInit() {
    const category = this.post.category || APP_KEY_VALUES.general_category;
    this.selectedCategory.set(category);
    const isGallery = category === APP_KEY_VALUES.image_gallery_category;
    const isService = category === APP_KEY_VALUES.service_category;
    const isPageText = category === 'page_text';
    const firstService = isService && this.post.services && this.post.services.length > 0 ? this.post.services[0] : { name: '', description: '' };

    const hero = this.post.pageContent?.hero || { eyebrow: '', title: '', description: '' };
    const sectionsData = this.post.pageContent?.sections || [];

    const sectionGroups = sectionsData.map((sec: IContentBlock) => {
      const paras = (sec.paragraphs || []).map(p => this._fb.control(p));
      return this._fb.group({
        title: [sec.title || ''],
        paragraphs: this._fb.array(paras)
      });
    });

    this.form = this._fb.group({
      category: [category, Validators.required],
      content: [isGallery || isService || isPageText ? '' : (this.post.content || ''), (isGallery || isService || isPageText) ? [] : [Validators.required]],
      page: [this.post.page || (isGallery ? APP_KEY_VALUES.image_gallery_category : isService ? APP_KEY_VALUES.service_category : APP_KEY_VALUES.about_page), (isGallery || isService) ? [] : [Validators.required]],
      serviceName: [isService ? firstService.name : ''],
      serviceDescription: [isService ? firstService.description : ''],
      heroEyebrow: [isPageText ? hero.eyebrow : ''],
      heroTitle: [isPageText ? hero.title : '', isPageText ? [Validators.required] : []],
      heroDescription: [isPageText ? hero.description : ''],
      sections: this._fb.array(sectionGroups)
    });

    this.form.get('category')?.valueChanges.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(cat => {
      this.selectedCategory.set(cat);
      const contentControl = this.form.get('content');
      const pageControl = this.form.get('page');
      const serviceNameControl = this.form.get('serviceName');
      const serviceDescControl = this.form.get('serviceDescription');
      const heroTitleControl = this.form.get('heroTitle');

      contentControl?.clearValidators();
      pageControl?.clearValidators();
      serviceNameControl?.clearValidators();
      serviceDescControl?.clearValidators();
      heroTitleControl?.clearValidators();

      if (cat === APP_KEY_VALUES.image_gallery_category) {
        contentControl?.setValue('');
        pageControl?.setValue(APP_KEY_VALUES.image_gallery_category);
      } else if (cat === APP_KEY_VALUES.service_category) {
        contentControl?.setValue('');
        pageControl?.setValue(APP_KEY_VALUES.service_category);
        serviceNameControl?.setValidators([Validators.required]);
        serviceDescControl?.setValidators([Validators.required]);
      } else if (cat === 'page_text') {
        contentControl?.setValue('');
        pageControl?.setValidators([Validators.required]);
        heroTitleControl?.setValidators([Validators.required]);
      } else {
        contentControl?.setValidators([Validators.required]);
        pageControl?.setValidators([Validators.required]);
      }

      contentControl?.updateValueAndValidity();
      pageControl?.updateValueAndValidity();
      serviceNameControl?.updateValueAndValidity();
      serviceDescControl?.updateValueAndValidity();
      heroTitleControl?.updateValueAndValidity();
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
          images: updatedImages,
          page: this.form.value.page
        };

        if (category === APP_KEY_VALUES.image_gallery_category) {
          updatedData.content = '';
          delete updatedData.services;
          delete updatedData.pageContent;
        } else if (category === APP_KEY_VALUES.service_category) {
          updatedData.content = '';
          updatedData.services = [{
            name: this.form.value.serviceName,
            description: this.form.value.serviceDescription
          }];
          delete updatedData.pageContent;
        } else if (category === 'page_text') {
          updatedData.content = '';
          updatedData.pageContent = {
            hero: {
              eyebrow: this.form.value.heroEyebrow || '',
              title: this.form.value.heroTitle || '',
              description: this.form.value.heroDescription || ''
            },
            sections: this.form.value.sections && this.form.value.sections.length > 0 ? this.form.value.sections : undefined
          };
          delete updatedData.services;
        } else {
          updatedData.content = this.form.value.content;
          delete updatedData.services;
          delete updatedData.pageContent;
        }

        await this._firebaseService.updateDocument(
          APP_KEY_VALUES.posts_collection,
          this.post.id!,
          updatedData
        );
        this.post.images = updatedImages;
        this.post.pageContent = updatedData.pageContent;
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