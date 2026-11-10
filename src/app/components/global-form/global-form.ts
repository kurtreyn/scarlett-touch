import { Component, Input, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
  private _destroyRef = inject(DestroyRef);

  @Input() public formType: IFormType['formType'] = 'post';

  public form!: FormGroup;
  public buttonText: string = 'Submit';
  public selectedCategory: string = '';

  public ngOnInit() {
    this._buildForm();
  }

  public get sectionsFormArray(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  public get sectionsControls() {
    return this.sectionsFormArray.controls;
  }

  public addSection(title: string = '', paragraphs: string[] = []) {
    const paragraphControls = paragraphs.map(p => this._fb.control(p));
    const sectionGroup = this._fb.group({
      title: [title],
      paragraphs: this._fb.array(paragraphControls)
    });
    this.sectionsFormArray.push(sectionGroup);
  }

  public removeSection(index: number) {
    this.sectionsFormArray.removeAt(index);
  }

  public getParagraphsFormArray(sectionIndex: number): FormArray {
    return this.sectionsFormArray.at(sectionIndex).get('paragraphs') as FormArray;
  }

  public getParagraphsControls(sectionIndex: number) {
    return this.getParagraphsFormArray(sectionIndex).controls;
  }

  public addParagraphToSection(sectionIndex: number, text: string = '') {
    this.getParagraphsFormArray(sectionIndex).push(this._fb.control(text));
  }

  public removeParagraphFromSection(sectionIndex: number, paragraphIndex: number) {
    this.getParagraphsFormArray(sectionIndex).removeAt(paragraphIndex);
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
        this.form = this._fb.group({
          category: ['', [Validators.required]],
          content: ['', [Validators.required]],
          page: ['', [Validators.required]],
          serviceName: [''],
          serviceDescription: [''],
          imageInput: [[]],
          heroEyebrow: [''],
          heroTitle: [''],
          heroDescription: [''],
          sections: this._fb.array([])
        });

        this.form.get('category')?.valueChanges.pipe(
          takeUntilDestroyed(this._destroyRef)
        ).subscribe(category => {
          this.selectedCategory = category;
          const contentControl = this.form.get('content');
          const pageControl = this.form.get('page');
          const serviceNameControl = this.form.get('serviceName');
          const serviceDescControl = this.form.get('serviceDescription');
          const heroTitleControl = this.form.get('heroTitle');

          contentControl?.clearValidators();
          pageControl?.clearValidators();
          serviceNameControl?.clearValidators();
          serviceDescControl?.clearValidators();
          heroTitleControl?.clearValidators();

          if (category === 'image_gallery') {
            contentControl?.setValue('');
            pageControl?.setValue('gallery');
          } else if (category === 'service') {
            contentControl?.setValue('');
            pageControl?.setValue('services');
            serviceNameControl?.setValidators([Validators.required]);
            serviceDescControl?.setValidators([Validators.required]);
          } else if (category === 'page_text') {
            contentControl?.setValue('');
            pageControl?.setValue('');
            pageControl?.setValidators([Validators.required]);
            heroTitleControl?.setValidators([Validators.required]);
          } else {
            contentControl?.setValidators([Validators.required]);
            pageControl?.setValidators([Validators.required]);
          }

          contentControl?.updateValueAndValidity();
          pageControl?.updateValueAndValidity();
          serviceNameControl?.updateValueAndValidity();
          serviceDescControl?.updateValueAndValidity();
          heroTitleControl?.updateValueAndValidity();
        });

        this.buttonText = 'Submit Post';
        break;
    }
  }

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
      this.sectionsFormArray.clear();
      this.selectedCategory = '';
    } else {
      this.form.markAllAsTouched();
    }
  }
}