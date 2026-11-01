import { Component } from '@angular/core';
import { GlobalForm } from '../global-form/global-form';

@Component({
  imports: [GlobalForm],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login { }
