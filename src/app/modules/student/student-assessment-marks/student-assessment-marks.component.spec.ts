import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAssessmentMarksComponent } from './student-assessment-marks.component';

describe('StudentAssessmentMarksComponent', () => {
  let component: StudentAssessmentMarksComponent;
  let fixture: ComponentFixture<StudentAssessmentMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentAssessmentMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAssessmentMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
