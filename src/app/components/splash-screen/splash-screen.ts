import { Component, Input } from '@angular/core';
import { IMAGE_RESOURCE_MAP, ICON_RESOURCE_MAP } from '../../../config/resourceMap';

@Component({
  selector: 'app-splash-screen',
  imports: [],
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.scss',
})
export class SplashScreen {
  public splashScreenImage = IMAGE_RESOURCE_MAP.splash_screen_image;
  public socialIcons = ICON_RESOURCE_MAP;
  @Input() announcements: string[] = ['Stay tuned for updates!'];
}
