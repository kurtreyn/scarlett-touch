import { Component } from '@angular/core';
import { GlobalForm } from '../global-form/global-form';

@Component({
  selector: 'app-main',
  imports: [GlobalForm],
  standalone: true,
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main { }
