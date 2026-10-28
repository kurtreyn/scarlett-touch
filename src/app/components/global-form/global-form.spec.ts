import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalForm } from './global-form';

describe('GlobalForm', () => {
  let component: GlobalForm;
  let fixture: ComponentFixture<GlobalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
