import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../nav/nav';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { IMAGE_RESOURCE_MAP } from '../../../config/resourceMap';

@Component({
  imports: [CommonModule, Nav],
  selector: 'app-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About extends AbstractGlobalState {
  public readonly IMAGE_RESOURCE_MAP = IMAGE_RESOURCE_MAP;
  public scarlettPicture: string = IMAGE_RESOURCE_MAP.scarlett_image;
}