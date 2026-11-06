import { Service } from '@angular/core';
import { IImage } from '../../models/state.interface';

@Service()
export class GeneralService {

    public getImageUrl(img: string | IImage): string {
        if (!img) return '';
        return typeof img === 'string' ? img : (img.url || '');
    }

    public isImageHidden(img: string | IImage): boolean {
        if (!img || typeof img === 'string') return false;
        return !!img.hide;
    }
}
