import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructorDashboardComponent } from './instructor-dashboard.component';
import { CourseService } from '../../../services/course.service';
import { CatalogService } from '../../../services/catalog.service';
import { of, throwError } from 'rxjs';
import { Course } from '../../../models/course';

// Mock Course and User data
const mockInstructorUser = {
  id: 42,
  fullName: 'Prof. Ada Lovelace',
  role: 'INSTRUCTOR'
};

const mockStudentUser = {
  id: 101,
  fullName: 'Stu Dent',
  role: 'STUDENT'
};

// FIX: Added 'domain' and 'level' to mockCourses to satisfy the requirements of the 'Course' type.
const mockCourses: Course[] = [
  { id: 1, title: 'Quantum Computing 101', instructorId: 42, description: '', price: 100, domain: 'Science', level: 'Advanced' },
  { id: 2, title: 'Advanced Algorithms', instructorId: 42, description: '', price: 200, domain: 'Technology', level: 'Intermediate' },
];

describe('InstructorDashboardComponent', () => {
  let component: InstructorDashboardComponent;
  let fixture: ComponentFixture<InstructorDashboardComponent>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let catalogServiceSpy: jasmine.SpyObj<CatalogService>;

  beforeEach(async () => {
    // 1. Create Jasmine spies for the service methods
    courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCoursesByInstructor']);
    catalogServiceSpy = jasmine.createSpyObj('CatalogService', ['getInstructors']); // Mocked even if not used

    await TestBed.configureTestingModule({
      // Since the component is not standalone, we use 'declarations' (or 'imports' if it was standalone)
      declarations: [InstructorDashboardComponent],
      providers: [
        // 2. Provide the spies as the implementation for the services
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: CatalogService, useValue: catalogServiceSpy }
      ]
    })
      .compileComponents();
  });

  // Helper function to mock localStorage
  const setupLocalStorage = (user: any | null) => {
    if (user) {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    } else {
      // For testing cases where user is null or absent
      spyOn(localStorage, 'getItem').and.returnValue(null);
    }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit (Instructor User)', () => {
    beforeEach(() => {
      // Mock successful service call with course data
      courseServiceSpy.getCoursesByInstructor.and.returnValue(of(mockCourses));
      // Setup localStorage for an Instructor
      setupLocalStorage(mockInstructorUser);
    });

    it('should set instructorId and fullName, and call loadCourses', () => {
      component.ngOnInit();
      
      // Expect component properties to be set
      expect(component.instructorId).toBe(mockInstructorUser.id);
      expect(component.selectedInstructorName).toBe(mockInstructorUser.fullName);
      
      // Expect loadCourses to be called and courses to be set
      expect(courseServiceSpy.getCoursesByInstructor).toHaveBeenCalledWith(mockInstructorUser.id);
      expect(component.courses.length).toBe(2);
      expect(component.courses).toEqual(mockCourses);
    });
  });

  describe('ngOnInit (Non-Instructor User)', () => {
    it('should not load courses if the user role is not INSTRUCTOR', () => {
      setupLocalStorage(mockStudentUser);
      component.ngOnInit();

      // Expect no ID to be set and no service call
      expect(component.instructorId).toBe(null);
      expect(component.selectedInstructorName).toBeUndefined();
      expect(courseServiceSpy.getCoursesByInstructor).not.toHaveBeenCalled();
      expect(component.courses.length).toBe(0);
    });

    it('should not load courses if no user data is in localStorage', () => {
      setupLocalStorage(null);
      component.ngOnInit();

      // Expect no ID to be set and no service call
      expect(component.instructorId).toBe(null);
      expect(courseServiceSpy.getCoursesByInstructor).not.toHaveBeenCalled();
      expect(component.courses.length).toBe(0);
    });
  });
  
  describe('loadCourses', () => {
    beforeEach(() => {
        // Initialize the ID for direct testing of loadCourses
        component.instructorId = mockInstructorUser.id;
    });

    it('should successfully fetch and assign courses when called directly', () => {
      courseServiceSpy.getCoursesByInstructor.and.returnValue(of(mockCourses));
      component.loadCourses();

      expect(courseServiceSpy.getCoursesByInstructor).toHaveBeenCalledWith(mockInstructorUser.id);
      expect(component.courses).toEqual(mockCourses);
    });

    it('should log an error when course service fails', () => {
      const errorResponse = new Error('HTTP Error');
      // Mock the service to return an error Observable
      courseServiceSpy.getCoursesByInstructor.and.returnValue(throwError(() => errorResponse));
      
      // Spy on console.error to check if the error is handled
      spyOn(console, 'error');

      component.loadCourses();

      expect(console.error).toHaveBeenCalledWith(errorResponse);
      expect(component.courses.length).toBe(0); // Courses should remain empty
    });

    it('should do nothing if instructorId is null', () => {
        component.instructorId = null;
        component.loadCourses();
        expect(courseServiceSpy.getCoursesByInstructor).not.toHaveBeenCalled();
    });
  });

});