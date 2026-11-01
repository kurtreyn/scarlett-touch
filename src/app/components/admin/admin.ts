import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../components/nav/nav';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { GlobalForm } from '../../components/global-form/global-form';
import { PostEditor } from '../../components/post-editor/post-editor';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, GlobalForm, PostEditor, Nav],
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin extends AbstractGlobalState {

  constructor() {
    super();
  }


}