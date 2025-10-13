import { TestBed } from '@angular/core/testing';
import { AssessmentFormComponent } from './assessment-form.component';
import { AssessmentService } from '../../../services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

// --- MOCK DATA ---
// NOTE: We assume the Assessment type is available for the compiler
const MOCK_ASSESSMENT: any = { id: '1', title: 'Mock Assessment', description: 'Mock', questions: [] }; 

// --- MOCK SERVICE SETUP (Jasmine style) ---
// We create empty objects to represent the services and will spy on their methods later.
const mockAssessmentService = {
  getAssessment: () => of(MOCK_ASSESSMENT), // Added mock data here
  addAssessment: () => of(MOCK_ASSESSMENT), 
  updateAssessment: () => of(MOCK_ASSESSMENT),
};

const mockRouter = {
  navigate: () => null,
};

// ActivatedRoute mock (Set to return null ID for Creation Mode)
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => null, 
    },
  },
};


describe('AssessmentFormComponent (Jasmine Save Test)', () => {
  let component: AssessmentFormComponent;
  let service: AssessmentService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentFormComponent],
      providers: [
        // Provide the mock objects
        { provide: AssessmentService, useValue: mockAssessmentService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    component = TestBed.createComponent(AssessmentFormComponent).componentInstance;
    
    // Inject the services provided in the testing module setup
    service = TestBed.inject(AssessmentService);
    router = TestBed.inject(Router);

    // --- Jasmine Spies (FIXED) ---
    // Create spies on the service methods we intend to test/track.
    // The spy must return an Observable of a type compatible with Assessment.
    spyOn(service, 'addAssessment').and.returnValue(of(MOCK_ASSESSMENT));
    spyOn(service, 'updateAssessment').and.returnValue(of(MOCK_ASSESSMENT));
    spyOn(router, 'navigate');

  });


  // --- FOCUSED TEST: CREATING A NEW ASSESSMENT ---
  it('should call addAssessment and navigate when saving a new record (no existing ID)', () => {
    // Arrange: Ensure the assessment object does NOT have an ID
    // We intentionally create a new object instance here for testing
    component.assessment = { title: 'New Quiz', description: 'desc', questions: [] };

    // Act: Execute the save function
    component.save();

    // Assert 1: Verify the correct service method was called with the component data
    expect(service.addAssessment).toHaveBeenCalledWith(component.assessment);
    
    // Assert 2: Verify the update method was NOT called
    expect(service.updateAssessment).not.toHaveBeenCalled();
    
    // Assert 3: Verify navigation occurred after save
    expect(router.navigate).toHaveBeenCalledWith(['instructor/add-assessment']);
  });
});
