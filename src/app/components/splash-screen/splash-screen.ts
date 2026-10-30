import { Component, inject, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DeviceDetectionService } from '../../services/device-detection/device-detection-service';
import { IMAGE_RESOURCE_MAP, ICON_RESOURCE_MAP } from '../../../config/resourceMap';

@Component({
  selector: 'app-splash-screen',
  imports: [],
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.scss',
})
export class SplashScreen implements OnInit, OnDestroy {
  private _deviceDetectionService = inject(DeviceDetectionService);
  private _destroy$ = new Subject<void>();

  public splashScreenImage = signal(IMAGE_RESOURCE_MAP.splash_screen_landscape_image);
  public socialIcons = ICON_RESOURCE_MAP;
  public isMobile = signal<boolean>(false);
  @Input() announcements: string[] = ['Stay tuned for updates!'];

  ngOnInit(): void {
    this._deviceDetectionService.observeMobile()
      .pipe(takeUntil(this._destroy$))
      .subscribe(matches => {
        this.isMobile.set(matches);
        this.splashScreenImage.set(matches ? IMAGE_RESOURCE_MAP.splash_screen_portrait_image : IMAGE_RESOURCE_MAP.splash_screen_landscape_image);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
