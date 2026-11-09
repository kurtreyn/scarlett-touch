import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../nav/nav';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { ImageViewer } from '../image-viewer/image-viewer';
import { LoadingScreen } from '../loading-screen/loading-screen';

@Component({
  imports: [CommonModule, Nav, ImageViewer, LoadingScreen],
  selector: 'app-gallery',
  styleUrl: './gallery.scss',
  templateUrl: './gallery.html',
})
export class Gallery extends AbstractGlobalState { }