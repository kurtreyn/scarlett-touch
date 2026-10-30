import { Directive, OnInit, OnDestroy, OnChanges, inject, signal } from '@angular/core';
import { FirebaseService } from '../services/firebase/firebase-service';
import { GlobalStateService } from '../services/global-state/global-state-service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { APP_KEY_VALUES } from '../../config/appKeyValues';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState implements OnInit, OnDestroy, OnChanges {
  private _globalStateService = inject(GlobalStateService);
  private _firebaseService = inject(FirebaseService);

  public isLoading = signal(false);
  public posts$!: Observable<any[]>;

  public logout() {
    return this._globalStateService.logout();
  }

  ngOnChanges(): void {
    // Handle changes here
  }

  ngOnInit(): void {
    // Initialization logic here
    this._globalStateService.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      console.log('Current user:', user);
    });
    this.posts$ = this._firebaseService.getPosts(APP_KEY_VALUES.posts_collection);
  }

  ngOnDestroy(): void {
    // Cleanup logic here
  }
}
