import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { GlobalStateService } from './services/global-state/global-state-service';
import { map, take, Observable } from 'rxjs';

export const authGuard = (): Observable<boolean | UrlTree> => {
    const globalState = inject(GlobalStateService);
    const router = inject(Router);

    return globalState.currentUser$.pipe(
        take(1),
        map(user => {
            if (user) {
                return true; // Allow access
            }
            // Redirect to home if not authenticated
            return router.createUrlTree(['/']);
        })
    );
};