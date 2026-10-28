import { Service } from '@angular/core';

@Service()
export class FormService {
    public submitForm(formData: any) {
        console.log('Form submitted via service', formData);
    }
}
