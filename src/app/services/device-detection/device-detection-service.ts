import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceDetectionService {
    private _breakpointObserver = inject(BreakpointObserver);

    // Exposes an observable stream that emits true/false based on screen size
    public observeMobile() {
        return this._breakpointObserver
            .observe([Breakpoints.Handset, '(max-width: 768px)'])
            .pipe(map(result => result.matches));
    }
}