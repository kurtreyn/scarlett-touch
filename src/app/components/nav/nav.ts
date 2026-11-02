import { Component, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  public isOpen = signal<boolean>(false);
  @Input() public useDarkLines: boolean = false;

  public navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Gallery', route: '/gallery' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' }
  ];

  public toggleMenu(): void {
    this.isOpen.update(value => !value);
  }

  public closeMenu(): void {
    this.isOpen.set(false);
  }
}