import { Component, Input, ViewChild, ElementRef, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IImage } from '../../models/state.interface';

@Component({
  selector: 'app-image-viewer',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './image-viewer.html',
  styleUrl: './image-viewer.scss',
})
export class ImageViewer {
  @Input() public images: (IImage)[] = [];
  @Input() public cardHeight: string = '350px';
  @Input() public viewMode: 'slider' | 'grid' = 'grid';
  public activeImage = signal<string | null>(null);

  @ViewChild('sliderContainer') private _sliderContainer!: ElementRef<HTMLElement>;


  public scroll(direction: 'left' | 'right') {
    const container = this._sliderContainer?.nativeElement;
    if (container) {
      const scrollAmount = 340;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  public openLightbox(img: IImage) {
    const url = img.url;
    if (url) {
      this.activeImage.set(url);
    }
  }

  public closeLightbox() {
    this.activeImage.set(null);
  }
}