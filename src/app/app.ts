import { Component, signal, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly _titleService = inject(Title);
  protected readonly _title = signal('The Scarlett Touch');

  constructor() {
    // Automatically updates the browser tab title whenever the signal changes
    effect(() => {
      this._titleService.setTitle(this._title());
    });
  }
}
