import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostEditorItem } from './post-editor-item';

describe('PostEditorItem', () => {
  let component: PostEditorItem;
  let fixture: ComponentFixture<PostEditorItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostEditorItem],
    }).compileComponents();

    fixture = TestBed.createComponent(PostEditorItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
