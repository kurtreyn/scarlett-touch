import { Component } from '@angular/core';
import { AbstractGlobalState } from '../../directives/abstract-global-state';
import { GlobalForm } from '../../components/global-form/global-form';

@Component({
  selector: 'app-admin',
  imports: [GlobalForm],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin extends AbstractGlobalState {

  constructor() {
    super();
  }

}
