import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceDetectionService {
    private _breakpointObserver = inject(BreakpointObserver);

    // Expose an observable stream based purely on portrait mode or explicit max-width
    public observeMobile() {
        return this._breakpointObserver
            .observe(['(max-width: 768px)', '(orientation: portrait)'])
            .pipe(map(result => result.matches));
    }
}