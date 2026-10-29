import { Component, signal, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AbstractGlobalState } from './directives/abstract-global-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App extends AbstractGlobalState {
  private readonly _titleService = inject(Title);
  protected readonly _title = signal('The Scarlett Touch');

  constructor() {
    // Automatically updates the browser tab title whenever the signal changes
    effect(() => {
      this._titleService.setTitle(this._title());
    });

    super();
  }
}
