import { Component, Input, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IImage } from '../../models/state.interface';

@Component({
  selector: 'app-image-slider',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './image-slider.html',
  styleUrl: './image-slider.scss',
})
export class ImageSlider {
  @Input() public images: (string | IImage)[] = [];
  @Input() public cardHeight: string = '350px';

  @ViewChild('sliderContainer') private _sliderContainer!: ElementRef<HTMLElement>;

  public activeImage = signal<string | null>(null);

  public scroll(direction: 'left' | 'right') {
    const container = this._sliderContainer.nativeElement;
    const scrollAmount = 340; // Approximate width of a slide item + gap
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  public getImageUrl(img: string | IImage): string {
    if (!img) return '';
    return typeof img === 'string' ? img : (img.url || '');
  }

  public isImageHidden(img: string | IImage): boolean {
    if (!img || typeof img === 'string') return false;
    return !!img.hide;
  }

  public openLightbox(img: string | IImage) {
    const url = this.getImageUrl(img);
    if (url) {
      this.activeImage.set(url);
    }
  }

  public closeLightbox() {
    this.activeImage.set(null);
  }
}