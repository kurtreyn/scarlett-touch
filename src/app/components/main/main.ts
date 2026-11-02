import { Component, inject } from '@angular/core';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { Nav } from '../nav/nav';
import { SplashScreen } from '../splash-screen/splash-screen';

@Component({
  selector: 'app-main',
  imports: [SplashScreen, Nav],
  standalone: true,
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main extends AbstractGlobalState {

  constructor() {
    super();
  }


}
