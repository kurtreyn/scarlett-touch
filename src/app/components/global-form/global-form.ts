import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/forms/form-service';
import { IFormType } from '../../models/state.interface';

@Component({
  selector: 'app-global-form',
  imports: [CommonModule, ReactiveFormsModule, NgTemplateOutlet],
  standalone: true,
  templateUrl: './global-form.html',
  styleUrl: './global-form.scss',
})
export class GlobalForm implements OnInit {
  private _fb = inject(FormBuilder);
  private _formService = inject(FormService);

  @Input() public formType: IFormType['formType'] = 'generic';

  public form!: FormGroup;

  public ngOnInit() {
    this._buildForm();
  }

  private _buildForm() {
    switch (this.formType) {
      case 'login':
        this.form = this._fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });
        break;
      case 'signup':
        this.form = this._fb.group({
          signupUsername: ['', [Validators.required]],
          signupEmail: ['', [Validators.required, Validators.email]],
          signupPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
        break;
      case 'contact':
        this.form = this._fb.group({
          contactName: ['', [Validators.required]],
          contactEmail: ['', [Validators.required, Validators.email]],
          contactMessage: ['', [Validators.required]]
        });
        break;
      case 'generic':
      default:
        this.form = this._fb.group({
          inputField: ['', [Validators.required]],
          imageInput: [null]
        });
        break;
    }
  }

  public onFileSelected(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [fieldName]: file });
    }
  }

  public onSubmit() {
    if (this.form.valid) {
      this._formService.submitForm(this.formType, this.form.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}