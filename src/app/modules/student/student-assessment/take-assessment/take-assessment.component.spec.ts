import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { TakeAssessmentComponent } from './take-assessment.component';
import { AssessmentService } from '../../../../services/assessment.service';
import { AssessmentAttemptService } from '../../../../services/assessment-attempt.service';
import { Assessment, Question } from '../../../../models/assessment';

describe('TakeAssessmentComponent', () => {
  let component: TakeAssessmentComponent;
  let fixture: ComponentFixture<TakeAssessmentComponent>;
  let assessmentServiceMock: any;
  let attemptServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const mockAssessment: Assessment = {
    id: 1,
    title: 'Assessment 1',
    description: 'Mock assessment',
    questions: [
      { id: 11, text: 'Question 1', options: ['A', 'B'], correctAnswer: 0 },
      { id: 12, text: 'Question 2', options: ['C', 'D'], correctAnswer: 1 }
    ]
  };

  beforeEach(async () => {
    assessmentServiceMock = {
      getAssessment: jasmine.createSpy().and.returnValue(of(mockAssessment))
    };
    attemptServiceMock = {
      postAttempt: jasmine.createSpy().and.returnValue(of({ score: 2, totalQuestions: 2 }))
    };
    routerMock = {
      navigate: jasmine.createSpy()
    };
    activatedRouteMock = {
      paramMap: of({
        get: (key: string) => (key === 'id' ? '1' : null)
      })
    };

    await TestBed.configureTestingModule({
      imports: [TakeAssessmentComponent],
      providers: [
        { provide: AssessmentService, useValue: assessmentServiceMock },
        { provide: AssessmentAttemptService, useValue: attemptServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TakeAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load assessment on init', () => {
    expect(component.assessment).toEqual(mockAssessment);
    expect(assessmentServiceMock.getAssessment).toHaveBeenCalledWith('1');
  });

  it('should handle missing assessment id', () => {
    const paramMapSubject = new Subject<any>();
    activatedRouteMock.paramMap = paramMapSubject.asObservable();

    fixture = TestBed.createComponent(TakeAssessmentComponent);
    component = fixture.componentInstance;
    assessmentServiceMock.getAssessment.calls.reset();
    fixture.detectChanges();

    // Emit without id
    paramMapSubject.next({ get: (k: string) => null });
    expect(assessmentServiceMock.getAssessment).not.toHaveBeenCalled();
  });

  it('should select answer for a question', () => {
    const q: Question = { id: 11, text: 'A question', options: ['a', 'b'], correctAnswer: 0 };
    component.onAnswerSelected(q, 1);
    expect(component.studentAnswers[11]).toBe(1);
  });

  it('should warn if question id is missing', () => {
    spyOn(console, 'warn');
    const q: Question = { id: undefined, text: 'No ID', options: [], correctAnswer: 0 };
    component.onAnswerSelected(q, 1);
    expect(console.warn).toHaveBeenCalled();
  });

  it('should submit assessment and handle success', fakeAsync(() => {
    spyOn(window, 'alert');
    component.assessment = mockAssessment;
    component.studentAnswers = { 11: 1, 12: 0 };

    component.submitAssessment();
    expect(component.submitInFlight).toBeTrue();
    tick();
    expect(component.submitInFlight).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Submitted! Score: 2/2');
    expect(routerMock.navigate).toHaveBeenCalledWith(['student/assessment-marks']);
  }));

  it('should handle submit error', fakeAsync(() => {
    spyOn(window, 'alert');
    attemptServiceMock.postAttempt.and.returnValue(throwError({ error: { message: 'Failed!' } }));
    component.assessment = mockAssessment;
    component.studentAnswers = { 11: 1, 12: 0 };

    component.submitAssessment();
    expect(component.submitInFlight).toBeTrue();
    tick();
    expect(component.submitInFlight).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Failed!');
  }));

  it('trackByQ should return question id', () => {
    const q: Question = { id: 22, text: 'test', options: [], correctAnswer: 0 };
    expect(component.trackByQ(0, q)).toBe(22);
  });

  it('trackByQ should fallback to index if id missing', () => {
    const q: Question = { id: undefined, text: 'test', options: [], correctAnswer: 0 };
    expect(component.trackByQ(5, q)).toBe(5);
  });
});