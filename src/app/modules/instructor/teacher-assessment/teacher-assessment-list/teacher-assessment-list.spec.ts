import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { TeacherAssessmentList } from './teacher-assessment/teacher-assessment-list';
import { TeacherAssessmentListComponent } from './teacher-assessment-list.component';

// I have changed from TeacherAssessmentList to TeacherAssessmentListComponent
describe('TeacherAssessmentList', () => {
  let component: TeacherAssessmentListComponent;
  let fixture: ComponentFixture<TeacherAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAssessmentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
