import { Service, inject } from '@angular/core';
import { FirebaseService } from '../firebase/firebase-service';
import { IFormData, IFormType } from '../../models/state.interface';

@Service()
export class FormService {
    private _firebaseService = inject(FirebaseService);

    public submitForm(formType: IFormType['formType'], formData: IFormData) {
        console.log('Form submitted via service', formType, formData);
        switch (formType) {
            case 'generic':
                // this._firebaseService.saveFormData(formType, formData);
                break;
            case 'login':
                if (formData.email && formData.password) {
                    this._firebaseService.login(formData.email, formData.password);
                }
                break;
            case 'signup':
                // this._firebaseService.saveFormData(formType, formData);
                break;
            case 'contact':
                // this._firebaseService.saveFormData(formType, formData);
                break;
            default:
                console.warn('Unknown form type:', formType);
        }

    }
}
