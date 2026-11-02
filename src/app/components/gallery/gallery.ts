import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../nav/nav';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
@Component({
  imports: [CommonModule, Nav],
  selector: 'app-gallery',
  styleUrl: './gallery.scss',
  templateUrl: './gallery.html',
})
export class Gallery extends AbstractGlobalState { }
