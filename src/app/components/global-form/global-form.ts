import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../services/forms/form-service';

@Component({
  selector: 'app-global-form',
  imports: [CommonModule, FormsModule, NgTemplateOutlet],
  standalone: true,
  templateUrl: './global-form.html',
  styleUrl: './global-form.scss',
})
export class GlobalForm {
  private _formService = inject(FormService);

  @Input() public formData: any = {};
  @Input() public formType: 'generic' | 'login' | 'signup' | 'contact' = 'generic';

  public onFileSelected(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.formData[fieldName] = file;
    }
  }


  public onSubmit() {
    this._formService.submitForm(this.formData);
    this.formData = {};
  }
}
