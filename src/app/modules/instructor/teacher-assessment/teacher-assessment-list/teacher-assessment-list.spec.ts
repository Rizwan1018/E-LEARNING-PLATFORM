import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TeacherAssessmentListComponent } from './teacher-assessment-list.component';
import { AssessmentService } from '../../../../services/assessment.service';
import { Assessment } from '../../../../models/assessment';

describe('TeacherAssessmentListComponent', () => {
  let component: TeacherAssessmentListComponent;
  let fixture: ComponentFixture<TeacherAssessmentListComponent>;
  let assessmentServiceMock: any;
  let router: Router;

  const mockAssessments: Assessment[] = [
    { id: 1, title: 'Science', description: 'Science Assessment', questions: [] },
    { id: 2, title: 'Math', description: 'Math Assessment', questions: [] }
  ];

  beforeEach(async () => {
    assessmentServiceMock = {
      getAssessments: jasmine.createSpy('getAssessments').and.returnValue(of(mockAssessments)),
      deleteAssessment: jasmine.createSpy('deleteAssessment').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        TeacherAssessmentListComponent, // Standalone: put component in imports (NOT declarations)
        RouterTestingModule // Use Angular's testing module for Router
      ],
      providers: [
        { provide: AssessmentService, useValue: assessmentServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherAssessmentListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load assessments on init and assign to property', () => {
    expect(assessmentServiceMock.getAssessments).toHaveBeenCalled();
    expect(component.assessments).toEqual(mockAssessments);
  });

  it('should set instructorId from localStorage if user is INSTRUCTOR', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 99, role: 'INSTRUCTOR' }));
    component.ngOnInit();
    expect(component.instructorId).toBe(99);
  });

  it('should not set instructorId if user is not INSTRUCTOR', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 99, role: 'STUDENT' }));
    component.ngOnInit();
    expect(component.instructorId).toBeNull();
  });

  it('should navigate to add assessment on add()', () => {
    component.add();
    expect(router.navigate).toHaveBeenCalledWith(['instructor/teacher/assessments/new']);
  });

  it('should navigate to edit page when edit() is called with valid id', () => {
    const assessment = mockAssessments[0];
    component.edit(assessment);
    expect(router.navigate).toHaveBeenCalledWith(['instructor', 'teacher', 'assessments', assessment.id]);
  });

  it('should alert if edit() is called with assessment without id', () => {
    spyOn(window, 'alert');
    component.edit({ title: 'No ID', description: '', questions: [] } as Assessment);
    expect(window.alert).toHaveBeenCalledWith('Missing assessment id');
  });

  it('should call service.deleteAssessment and reload when confirmed', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'load');
    const assessment = mockAssessments[0];
    component.deleteAssessment(assessment);
    tick();
    expect(assessmentServiceMock.deleteAssessment).toHaveBeenCalledWith(assessment.id!.toString());
    expect(component.load).toHaveBeenCalled();
  }));

  it('should not call deleteAssessment if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const assessment = mockAssessments[0];
    component.deleteAssessment(assessment);
    expect(assessmentServiceMock.deleteAssessment).not.toHaveBeenCalled();
  });

  it('should navigate to marks page on viewMarks()', () => {
    const assessment = mockAssessments[0];
    component.viewMarks(assessment);
    expect(router.navigate).toHaveBeenCalledWith(['instructor/teacher/assessments', assessment.id, 'marks']);
  });
});