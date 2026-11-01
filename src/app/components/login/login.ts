import { Component } from '@angular/core';
import { Nav } from '../nav/nav';
import { GlobalForm } from '../global-form/global-form';

@Component({
  imports: [GlobalForm, Nav],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login { }
