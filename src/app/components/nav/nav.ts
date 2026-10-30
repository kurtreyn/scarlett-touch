import { Component, signal } from '@angular/core';
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

  public navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Gallery', route: '/gallery' },
    { label: 'Announcements', route: '/announcements' },
    { label: 'Contact', route: '/contact' }
  ];

  public toggleMenu(): void {
    this.isOpen.update(value => !value);
  }

  public closeMenu(): void {
    this.isOpen.set(false);
  }
}