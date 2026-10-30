import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { GlobalForm } from '../../components/global-form/global-form';
import { PostEditor } from '../../components/post-editor/post-editor';
import { FirebaseService } from '../../services/firebase/firebase-service';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, GlobalForm, PostEditor],
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin extends AbstractGlobalState implements OnInit {
  private _firebaseService = inject(FirebaseService);

  public posts$!: Observable<any[]>;

  constructor() {
    super();
  }

  public override ngOnInit(): void {
    this.posts$ = this._firebaseService.getPosts(APP_KEY_VALUES.posts_collection);
  }
}