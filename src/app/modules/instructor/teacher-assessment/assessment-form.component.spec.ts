import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentFormComponent } from './assessment-form.component';

describe('AssessmentFormComponent', () => {
  let component: AssessmentFormComponent;
  let fixture: ComponentFixture<AssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
