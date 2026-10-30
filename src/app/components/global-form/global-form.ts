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

  @Input() public formType: IFormType['formType'] = 'post';

  public form!: FormGroup;
  public buttonText: string = 'Submit';

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
        this.buttonText = 'Login';
        break;
      case 'signup':
        this.form = this._fb.group({
          signupUsername: ['', [Validators.required]],
          signupEmail: ['', [Validators.required, Validators.email]],
          signupPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
        this.buttonText = 'Sign Up';
        break;
      case 'contact':
        this.form = this._fb.group({
          contactName: ['', [Validators.required]],
          contactEmail: ['', [Validators.required, Validators.email]],
          contactMessage: ['', [Validators.required]]
        });
        this.buttonText = 'Send Message';
        break;
      case 'post':
      default:
        // Refactored for creating a new Firebase post
        this.form = this._fb.group({
          postTopic: ['', [Validators.required]],
          inputField: ['', [Validators.required]],
          imageInput: [[]]
        });
        this.buttonText = 'Submit Post';
        break;
    }
  }

  // Public because it is called directly from the HTML template event binding
  public onFileSelected(event: any, fieldName: string) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const files: File[] = Array.from(fileList);
      this.form.patchValue({ [fieldName]: files });
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