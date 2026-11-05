import { Component, Input, ViewChild, ElementRef, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../services/general/general-service';
import { IImage } from '../../models/state.interface';

@Component({
  selector: 'app-image-slider',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './image-slider.html',
  styleUrl: './image-slider.scss',
})
export class ImageSlider {
  private _generalService = inject(GeneralService);
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
    return this._generalService.getImageUrl(img);
  }

  public isImageHidden(img: string | IImage): boolean {
    return this._generalService.isImageHidden(img);
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