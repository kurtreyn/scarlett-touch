import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../nav/nav';
import { LoadingScreen } from '../loading-screen/loading-screen';
import { AbstractGlobalState } from '../../directives/abstract-global-state';

@Component({
  imports: [CommonModule, Nav, LoadingScreen],
  selector: 'app-services-page',
  styleUrl: './services-page.scss',
  templateUrl: './services-page.html',
})
export class ServicesPage extends AbstractGlobalState { }
