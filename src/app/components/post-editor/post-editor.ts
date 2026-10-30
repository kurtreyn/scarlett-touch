import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../../services/firebase/firebase-service';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';

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

  @Input() public posts: any[] | null = [];

  public isLoading = signal(false);
  private _editForms: { [postId: string]: FormGroup } = {};

  public getEditForm(postId: string, currentTopic?: string, currentContent?: string): FormGroup {
    if (!this._editForms[postId]) {
      this._editForms[postId] = this._fb.group({
        topic: [currentTopic || '', Validators.required],
        content: [currentContent || '', Validators.required]
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
        const updatedData = {
          topic: form.value.topic,
          content: form.value.content,
          images: post.images
        };
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
    }
  }
}