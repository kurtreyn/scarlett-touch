import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../nav/nav';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { ImageSlider } from '../image-slider/image-slider';

@Component({
  imports: [CommonModule, Nav, ImageSlider],
  selector: 'app-gallery',
  styleUrl: './gallery.scss',
  templateUrl: './gallery.html',
})
export class Gallery extends AbstractGlobalState { }
