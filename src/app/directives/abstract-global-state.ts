import { Directive, OnInit, OnDestroy, OnChanges, inject, signal } from '@angular/core';
import { GlobalStateService } from '../services/global-state/global-state-service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState implements OnInit, OnDestroy, OnChanges {
  private _globalStateService = inject(GlobalStateService);

  public isLoading = signal(false);

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
  }

  ngOnDestroy(): void {
    // Cleanup logic here
  }
}
