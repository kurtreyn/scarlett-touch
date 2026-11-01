import { Directive, OnInit, OnDestroy, OnChanges, inject, signal } from '@angular/core';
import { FirebaseService } from '../services/firebase/firebase-service';
import { GlobalStateService } from '../services/global-state/global-state-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { APP_KEY_VALUES } from '../../config/appKeyValues';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState implements OnInit, OnDestroy, OnChanges {
  private _globalStateService = inject(GlobalStateService);
  private _firebaseService = inject(FirebaseService);
  private _toastr = inject(ToastrService);
  private _router = inject(Router);

  public isLoading = signal(false);
  public posts$!: Observable<any[]>;

  public logout() {
    return this._globalStateService.logout().then(() => {
      this._toastr.success('Logged out successfully', 'Success');
      this._router.navigate(['/login']);
    }).catch(error => {
      this._toastr.error('Logout failed', 'Error');
    });
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
