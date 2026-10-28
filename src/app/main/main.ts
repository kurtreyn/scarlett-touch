import { Component } from '@angular/core';
import { RouterOutlet } from "../../../node_modules/@angular/router/types/_router_module-chunk";
import { Home } from '../pages/home/home';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Home],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main { }
