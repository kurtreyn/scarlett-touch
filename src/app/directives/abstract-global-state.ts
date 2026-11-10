import { Directive, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FirebaseService } from '../services/firebase/firebase-service';
import { GlobalStateService } from '../services/global-state/global-state-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { APP_KEY_VALUES } from '../../config/appKeyValues';
import { PAGE_TEXT_CONTENT } from '../../config/pageTextContent';
import { IPost, IPageContent } from '../models/state.interface';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState implements OnInit, OnDestroy {
  private _globalStateService = inject(GlobalStateService);
  private _firebaseService = inject(FirebaseService);
  private _toastr = inject(ToastrService);
  private _router = inject(Router);

  public isLoading = signal(true);
  public posts$: Observable<IPost[]> = new Observable<IPost[]>();

  // Centralized derived streams for pages
  public aboutPosts$: Observable<IPost[]> = new Observable<IPost[]>();
  public galleryPosts$: Observable<IPost[]> = new Observable<IPost[]>();
  public servicesPosts$: Observable<IPost[]> = new Observable<IPost[]>();
  public homePageAnnouncements$: Observable<IPost[]> = new Observable<IPost[]>();

  // Reactive Page Content streams with fallback to default PAGE_TEXT_CONTENT
  public aboutPageContent$: Observable<IPageContent> = new Observable<IPageContent>();
  public galleryPageContent$: Observable<IPageContent> = new Observable<IPageContent>();
  public servicesPageContent$: Observable<IPageContent> = new Observable<IPageContent>();

  public async logout() {
    this.isLoading.set(true);
    return this._globalStateService.logout().then(() => {
      this._toastr.success('Logged out successfully', 'Success');
      this._router.navigate(['/login']);
    }).catch(error => {
      this._toastr.error('Logout failed', 'Error');
    }).finally(() => {
      this.isLoading.set(false);
    });
  }

  ngOnInit(): void {
    this._globalStateService.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      console.log('Current user:', user);
    });

    this._loadPosts();
    this.aboutPosts$.pipe(take(1)).subscribe(posts => {
      console.log('About posts:', posts);
    });
  }

  ngOnDestroy(): void { }

  private _loadPosts() {
    this.isLoading.set(true);
    this.posts$ = this._firebaseService.getPosts(APP_KEY_VALUES.posts_collection) as Observable<IPost[]>;
    this.posts$ = this.posts$.pipe(
      map(posts => posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    );

    // Initialize derived streams using the centralized state
    this.aboutPosts$ = this.posts$.pipe(
      map(posts => posts.filter(post => (post.page === APP_KEY_VALUES.about_page && post.category === APP_KEY_VALUES.announcements_category) || post.category === APP_KEY_VALUES.announcements_category))
    );

    this.galleryPosts$ = this.posts$.pipe(
      map(posts => posts.filter(post => post.category === APP_KEY_VALUES.image_gallery_category || post.page === APP_KEY_VALUES.gallery_page))
    );

    this.servicesPosts$ = this.posts$.pipe(
      map(posts => posts.filter(post => post.category === APP_KEY_VALUES.service_category || post.page === APP_KEY_VALUES.services_page))
    );

    this.homePageAnnouncements$ = this.posts$.pipe(
      map(posts => posts
        .filter(post => post.category === APP_KEY_VALUES.announcements_category && post.page === APP_KEY_VALUES.home_page)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      )
    );

    // Page text content resolution streams
    this.aboutPageContent$ = this.posts$.pipe(
      map(posts => {
        const customPost = posts.find(p => p.category === 'page_text' && (p.page === 'about' || p.page === APP_KEY_VALUES.about_page));
        return customPost?.pageContent || PAGE_TEXT_CONTENT.about;
      })
    );

    this.galleryPageContent$ = this.posts$.pipe(
      map(posts => {
        const customPost = posts.find(p => p.category === 'page_text' && (p.page === 'gallery' || p.page === APP_KEY_VALUES.gallery_page));
        return customPost?.pageContent || PAGE_TEXT_CONTENT.gallery;
      })
    );

    this.servicesPageContent$ = this.posts$.pipe(
      map(posts => {
        const customPost = posts.find(p => p.category === 'page_text' && (p.page === 'services' || p.page === APP_KEY_VALUES.services_page));
        return customPost?.pageContent || PAGE_TEXT_CONTENT.services;
      })
    );

    this.posts$.pipe(take(1)).subscribe(() => {
      this.isLoading.set(false);
    });
  }
}