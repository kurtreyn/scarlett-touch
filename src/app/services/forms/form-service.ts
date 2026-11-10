import { Service, inject } from '@angular/core';
import { FirebaseService } from '../firebase/firebase-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IFormData, IFormType } from '../../models/state.interface';
import { GlobalStateService } from '../global-state/global-state-service';

@Service()
export class FormService {
    private _firebaseService = inject(FirebaseService);
    private _globalStateService = inject(GlobalStateService);
    private _router = inject(Router);
    private _toastr = inject(ToastrService);

    public async submitForm(formType: IFormType['formType'], formData: IFormData) {
        console.log('Form submitted via service', formType, formData);
        switch (formType) {
            case 'post':
                try {
                    const services = formData.category === 'service' && formData.serviceName ? [{
                        name: formData.serviceName,
                        description: formData.serviceDescription || ''
                    }] : undefined;

                    const pageContent = formData.category === 'page_text' ? {
                        hero: {
                            eyebrow: formData.heroEyebrow || '',
                            title: formData.heroTitle || '',
                            description: formData.heroDescription || ''
                        },
                        sections: formData.sections && formData.sections.length > 0 ? formData.sections : undefined
                    } : undefined;

                    await this._firebaseService.submitPost({
                        category: formData.category,
                        content: formData.content,
                        page: formData.page,
                        services: services,
                        files: formData.imageInput,
                        pageContent: pageContent
                    });
                    this._toastr.success('Post successfully created!', 'Success');
                } catch (error) {
                    console.error('Post submission failed:', error);
                    this._toastr.error('Post submission failed.', 'Error');
                }
                break;
            case 'login':
                if (formData.email && formData.password) {
                    this._globalStateService.login(formData.email, formData.password).then((response) => {
                        this._router.navigate(['/admin']);
                    }).catch((error) => {
                        this._toastr.error('Login failed', 'Error');
                    });
                }
                break;
            case 'signup':
                break;
            case 'contact':
                break;
            default:
                console.warn('Unknown form type:', formType);
        }
    }
}