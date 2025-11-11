import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StudentDashboardComponent } from './student-dashboard.component';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';

describe('StudentDashboardComponent', () => {
  let component: StudentDashboardComponent;
  let fixture: ComponentFixture<StudentDashboardComponent>;
  let catalogSpy: jasmine.SpyObj<CatalogService>;
  let enrollSpy: jasmine.SpyObj<EnrollmentService>;
  const mockCourses: Course[] = [
    { id: 10, title: 'C1', instructorId: 1, domain: 'Dev', level: 'Beginner', durationHrs: 5, tags: '', description: '', price: 0, rating: 0, studentsCount: 0, thumbnail: '', videoUrl: '' },
    { id: 20, title: 'C2', instructorId: 2, domain: 'Dev', level: 'Advanced', durationHrs: 10, tags: '', description: '', price: 0, rating: 0, studentsCount: 0, thumbnail: '', videoUrl: '' }
  ];
  const mockEnrollments: Enrollment[] = [
    { id: 1, studentId: 42, courseId: 10, progress: 50, enrollmentDate: '2025-01-01' },
    { id: 2, studentId: 42, courseId: 20, progress: 100, enrollmentDate: '2025-01-02' }
  ];

  beforeEach(waitForAsync(() => {
    catalogSpy = jasmine.createSpyObj('CatalogService', ['getCourses']);
    enrollSpy = jasmine.createSpyObj('EnrollmentService', ['getEnrollmentsByStudent']);

    TestBed.configureTestingModule({
      declarations: [StudentDashboardComponent],
      providers: [
        { provide: CatalogService, useValue: catalogSpy },
        { provide: EnrollmentService, useValue: enrollSpy },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();
  }));

  afterEach(() => {
    localStorage.removeItem('user');
  });

  it('should create', () => {
    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set selected student from localStorage and load dashboard with stats', () => {
    // arrange - set user in localStorage
    localStorage.setItem('user', JSON.stringify({ role: 'STUDENT', id: 42, fullName: 'Test Student' }));

    // spies return observables
    catalogSpy.getCourses.and.returnValue(of(mockCourses));
    enrollSpy.getEnrollmentsByStudent.and.returnValue(of(mockEnrollments));

    // act
    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit -> loadDashboard

    // assert basic selection
    expect(component.selectedStudentId).toBe(42);
    expect(component.selectedStudentName).toBe('Test Student');

    // forkJoin should have been called through the spies
    expect(catalogSpy.getCourses).toHaveBeenCalled();
    expect(enrollSpy.getEnrollmentsByStudent).toHaveBeenCalledWith(42);

    // stats computed from mock data:
    expect(component.enrolledCount).toBe(2);
    // learningHours = durationHrs of course id 10 + id 20 = 5 + 10 = 15
    expect(component.learningHours).toBe(15);
    // averageProgress = round((50 + 100)/2) = 75
    expect(component.averageProgress).toBe(75);

    // courseFor helper
    const firstEnrollment = component.enrollments[0];
    const linkedCourse = component.courseFor(firstEnrollment);
    expect(linkedCourse).toBeDefined();
    expect(linkedCourse?.id).toBe(10);
  });

  it('loadDashboard should clear state when no selectedStudentId', () => {
    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;

    // ensure no student selected
    component.selectedStudentId = 0;
    component.enrollments = [{ id: 99, studentId: 0, courseId: 999, progress: 10, enrollmentDate: '2025-01-03' }];
    component.coursesById.set(999, { id: 999, title: 'X', instructorId: 0, domain: '', level: '', durationHrs: 100, tags: '', description: '', price: 0, rating: 0, studentsCount: 0, thumbnail: '', videoUrl: '' });

    component.loadDashboard();

    expect(component.enrollments.length).toBe(0);
    expect(component.coursesById.size).toBe(0);
    expect(component.enrolledCount).toBe(0);
    expect(component.learningHours).toBe(0);
  });
});