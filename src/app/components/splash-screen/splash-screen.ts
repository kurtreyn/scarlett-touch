import { Component } from '@angular/core';
import { RESOURCE_MAP } from '../../../config/resourceMap';

@Component({
  selector: 'app-splash-screen',
  imports: [],
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.scss',
})
export class SplashScreen {
  public splashScreenImage = RESOURCE_MAP.splash_screen_image;
}
