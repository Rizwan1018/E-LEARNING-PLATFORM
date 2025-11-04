import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCourseComponent } from './add-course.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { CatalogService } from '../../../services/catalog.service';
import { of } from 'rxjs';
import { Course } from '../../../models/course';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Essential for services that use HttpClient

// Mock data for a course
const mockCourse: Course = {
  id: 1,
  title: 'Angular Testing',
  instructorId: 101,
  domain: 'Development',
  level: 'Intermediate',
  durationHrs: 15,
  tags: 'Angular, RxJS, Testing',
  description: 'Learn unit testing with Angular.',
  price: 50,
  rating: 4.5,
  studentsCount: 100,
  thumbnail: '',
  videoUrl: '',
};

// Mock user data for instructor
const mockInstructorUser = {
  role: 'INSTRUCTOR',
  id: 101,
  instructorId: 101,
  email: 'instructor@test.com',
};

describe('AddCourseComponent', () => {
  let component: AddCourseComponent;
  let fixture: ComponentFixture<AddCourseComponent>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let catalogServiceSpy: jasmine.SpyObj<CatalogService>;

  beforeEach(async () => {
    // 1. Create Jasmine Spies for services
    const spyCourse = jasmine.createSpyObj('CourseService', [
      'getCoursesByInstructor',
      'getCourses',
      'addCourse',
      'updateCourse',
      'deleteCourse',
    ]);
    const spyCatalog = jasmine.createSpyObj('CatalogService', ['getDomains']);

    // 2. Setup localStorage mock for instructor
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return JSON.stringify(mockInstructorUser);
      }
      return null;
    });

    await TestBed.configureTestingModule({
      declarations: [AddCourseComponent],
      // Import modules: ReactiveFormsModule for forms and HttpClientTestingModule for resolving API service dependencies
      imports: [ReactiveFormsModule, HttpClientTestingModule], 
      providers: [
        FormBuilder, 
        { provide: CourseService, useValue: spyCourse },
        { provide: CatalogService, useValue: spyCatalog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCourseComponent);
    component = fixture.componentInstance;
    courseServiceSpy = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    catalogServiceSpy = TestBed.inject(CatalogService) as jasmine.SpyObj<CatalogService>;

    // 3. Mock service returns
    courseServiceSpy.getCoursesByInstructor.and.returnValue(of([mockCourse]));
    courseServiceSpy.addCourse.and.returnValue(of(mockCourse));
    courseServiceSpy.updateCourse.and.returnValue(of(mockCourse));
    // deleteCourse returns an Observable<void> or similar
    courseServiceSpy.deleteCourse.and.returnValue(of(undefined)); 

    // 4. Trigger ngOnInit to initialize the form and load data
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and load instructor courses in ngOnInit', () => {
    // Assert form initialization
    expect(component.courseForm).toBeDefined();
    // Assert instructorId is patched correctly from mock user
    expect(component.instructorId).toBe(mockInstructorUser.instructorId);
    expect(component.courseForm.get('instructorId')?.value).toBe(mockInstructorUser.instructorId);
    // Assert required validator is present
    expect(component.courseForm.get('title')?.hasValidator(Validators.required)).toBe(true);

    // Assert course service was called and data loaded
    expect(courseServiceSpy.getCoursesByInstructor).toHaveBeenCalledWith(mockInstructorUser.instructorId);
    expect(component.courses.length).toBe(1);
  });

  it('should correctly store selected file for thumbnail', () => {
    const mockFile = new File([''], 'thumb.jpg', { type: 'image/jpeg' });
    // Mock the event structure to simulate file selection
    const mockEvent = { target: { files: [mockFile] } };

    component.onThumbnailFileSelect(mockEvent, 'thumbnail');
    expect(component.selectedThumbnail).toBe(mockFile);
    expect(component.selectedVideo).toBeNull();
  });
  
  it('should correctly store selected file for video', () => {
    const mockFile = new File([''], 'lecture.mp4', { type: 'video/mp4' });
    const mockEvent = { target: { files: [mockFile] } };

    component.onVideoFileSelect(mockEvent, 'video');
    expect(component.selectedVideo).toBe(mockFile);
  });
  
  it('should correctly store selected file for prerequisite', () => {
    const mockFile = new File([''], 'pre-req.pdf', { type: 'application/pdf' });
    const mockEvent = { target: { files: [mockFile] } };

    component.onPrerequisiteFileSelect(mockEvent, 'prerequisite');
    expect(component.selectedPrerequisite).toBe(mockFile);
  });

  it('should set editingCourseId and patch the form with course data when calling edit()', () => {
    component.edit(mockCourse);

    expect(component.editingCourseId).toBe(mockCourse.id);
    expect(component.courseForm.get('title')?.value).toBe(mockCourse.title);
    expect(component.courseForm.get('tags')?.value).toBe(mockCourse.tags);
    expect(component.courseForm.get('durationHrs')?.value).toBe(mockCourse.durationHrs);
  });
  
  it('should call addCourse and reset the form when adding a new course', () => {
    // Setup component state for adding
    component.editingCourseId = null;
    component.selectedThumbnail = new File([''], 'thumb.jpg');
    component.courseForm.patchValue({
      title: 'New Course',
      domain: 'Tech',
      level: 'Beginner',
      durationHrs: 5,
      description: 'A new one',
      tags: 'new, tech',
      instructorId: mockInstructorUser.instructorId
    });

    component.OnSubmit();

    // Assert addCourse was called with FormData
    expect(courseServiceSpy.addCourse).toHaveBeenCalledTimes(1);
    expect(courseServiceSpy.addCourse).toHaveBeenCalledWith(jasmine.any(FormData));
    
    // Assert state reset
    expect(component.message).toContain('Course added successfully');
    expect(component.courseForm.get('title')?.value).toBeNull(); 
    expect(courseServiceSpy.getCoursesByInstructor).toHaveBeenCalledTimes(2); // Initial load + refresh
  });
  
  it('should call updateCourse and reset state when editing an existing course', () => {
    // Setup state for editing
    component.editingCourseId = mockCourse.id!;
    component.courseForm.patchValue({ title: 'Updated Title', instructorId: mockCourse.instructorId });

    component.OnSubmit();

    // Assert updateCourse was called with ID and FormData
    expect(courseServiceSpy.updateCourse).toHaveBeenCalledWith(
      mockCourse.id!,
      jasmine.any(FormData)
    );

    // Assert state reset
    expect(component.message).toContain('Course updated successfully');
    expect(component.editingCourseId).toBeNull(); 
    expect(courseServiceSpy.getCoursesByInstructor).toHaveBeenCalledTimes(2); // Initial load + refresh
  });

  it('should call deleteCourse on removal', () => {
    const courseIdToDelete = 5;
    component.remove(courseIdToDelete);

    expect(courseServiceSpy.deleteCourse).toHaveBeenCalledWith(courseIdToDelete);
    expect(component.message).toContain('Course deleted successfully');
    expect(courseServiceSpy.getCoursesByInstructor).toHaveBeenCalledTimes(2); // Initial load + refresh
  });
});
