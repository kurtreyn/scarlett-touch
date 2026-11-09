import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../models/state.interface';
import { PostEditorItem } from '../post-editor-item/post-editor-item';

@Component({
  selector: 'app-post-editor',
  imports: [CommonModule, PostEditorItem],
  standalone: true,
  templateUrl: './post-editor.html',
  styleUrl: './post-editor.scss',
})
export class PostEditor {
  @Input() public posts: IPost[] | null = [];
}