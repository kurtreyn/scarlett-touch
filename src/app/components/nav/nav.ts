import { Component, signal, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalStateService } from '../../services/global-state/global-state-service';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  private _globalStateService = inject(GlobalStateService);
  public isOpen = signal<boolean>(false);
  public canShowLink = computed(() => {
    return (link: { label: string, route: string }) => {
      if (link.label === 'Admin' || link.label === 'Login') {
        return this._globalStateService.isLoggedIn();
      }
      return true;
    };
  })
  @Input() public useDarkLines: boolean = false;

  public navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Gallery', route: '/gallery' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'Login', route: '/login' },
    { label: 'Admin', route: '/admin' }
  ];

  public toggleMenu(): void {
    this.isOpen.update(value => !value);
  }

  public closeMenu(): void {
    this.isOpen.set(false);
  }
}