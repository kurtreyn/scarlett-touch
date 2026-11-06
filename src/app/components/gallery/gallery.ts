import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../nav/nav';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { ImageViewer } from '../image-viewer/image-viewer';

@Component({
  imports: [CommonModule, Nav, ImageViewer],
  selector: 'app-gallery',
  styleUrl: './gallery.scss',
  templateUrl: './gallery.html',
})
export class Gallery extends AbstractGlobalState { }