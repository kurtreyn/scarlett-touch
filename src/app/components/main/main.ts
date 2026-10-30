import { Component, inject } from '@angular/core';
import { GlobalForm } from '../global-form/global-form';
import { AbstractGlobalState } from '../../directives/abstract-global-state';

@Component({
  selector: 'app-main',
  imports: [GlobalForm],
  standalone: true,
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main extends AbstractGlobalState {

  constructor() {
    super();
  }


}
