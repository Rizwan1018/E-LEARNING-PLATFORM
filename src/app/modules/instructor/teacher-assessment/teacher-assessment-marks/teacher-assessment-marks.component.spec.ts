import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssessmentMarksComponent } from './teacher-assessment-marks.component';

describe('TeacherAssessmentMarksComponent', () => {
  let component: TeacherAssessmentMarksComponent;
  let fixture: ComponentFixture<TeacherAssessmentMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherAssessmentMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAssessmentMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
