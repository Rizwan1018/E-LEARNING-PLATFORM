import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssessmentFormComponent } from './assessment-form.component';
import { AssessmentService } from '../../../services/assessment.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AssessmentFormComponent', () => {
  let component: AssessmentFormComponent;
  let fixture: ComponentFixture<AssessmentFormComponent>;
  let serviceMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(async () => {
    serviceMock = {
      getAssessment: jasmine.createSpy('getAssessment').and.returnValue(of({
        id: 5,
        title: "SampleQ",
        description: "Description of q",
        questions: [
          {
            text: "Test?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 2
          }
        ]
      })),
      addAssessment: jasmine.createSpy('addAssessment').and.returnValue(of({})),
      updateAssessment: jasmine.createSpy('updateAssessment').and.returnValue(of({}))
    };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };
    await TestBed.configureTestingModule({
      declarations: [AssessmentFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AssessmentService, useValue: serviceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call service.updateAssessment for edit (id present)', fakeAsync(() => {
    component.form.patchValue({
      id: 55,
      title: 'EditTitle',
      description: 'This is a long enough valid description'
    });
    component.questions.at(0).patchValue({
      text: "Q?",
      options: ["one", "two", "three", "four"],
      correctAnswer: 1
    });
    // Mark all as touched/dirty to ensure validation fires
    component.questions.at(0).markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    tick();
    expect(serviceMock.updateAssessment).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalled();
  }));

  it('should handle service error on submit', fakeAsync(() => {
    component.form.get('id')?.setValue(null);
    serviceMock.addAssessment.and.returnValue(throwError(() => new Error("Failed!")));
    spyOn(console, 'error');
    component.form.patchValue({
      title: 'QuizX',
      description: 'Valid description here'
    });
    component.questions.at(0).patchValue({
      text: "Q?",
      options: ["option1", "option2", "option3", "option4"],
      correctAnswer: 0
    });
    // Mark all as touched to sanitize triggers
    component.questions.at(0).markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalled();
  }));

});