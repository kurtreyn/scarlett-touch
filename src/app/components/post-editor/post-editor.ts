import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @Input() public posts: any[] | null = [];

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

    try {
      // 1. Delete the physical file from Firebase Storage
      await this._firebaseService.deleteImageFile(imageUrlToDelete);

      // 2. Update the Firestore document to remove the image URL from the array
      await this._firebaseService.updateDocument(
        APP_KEY_VALUES.posts_collection,
        post.id,
        { images: updatedImages }
      );

      post.images = updatedImages; // Instant local view update
      console.log('Image removed from storage and post updated!');
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  }

  public async onUpdatePost(post: any) {
    const form = this._editForms[post.id];
    if (form && form.valid) {
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
        console.log('Post successfully updated!');
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  }
}