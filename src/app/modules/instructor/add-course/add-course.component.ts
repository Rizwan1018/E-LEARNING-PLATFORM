import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-add-course',
  standalone: false,
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  courseForm!: FormGroup;
  message = '';
  courses: Course[] = [];
  editingCourseId: number | null = null;   // ✅ track editing

  constructor(private fb: FormBuilder, private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      instructorId: [1001, Validators.required],
      domain: ['', Validators.required],
      level: ['', Validators.required],
      durationHrs: [null],
      tags: [''],
      description: ['']
    });

    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error(err)
    });
  }

OnSubmit() {
  if (this.courseForm.invalid) return;

  const fv = this.courseForm.value;

  const tagsArray =
    fv.tags && typeof fv.tags === 'string'
      ? fv.tags.split(',').map((tag: string) => tag.trim())
      : [];

  // Common payload (exclude `id` here)
  const courseData: Omit<Course, 'id'> = {
    title: fv.title,
    instructorId: +fv.instructorId,
    domain: fv.domain,
    level: fv.level,
    durationHrs: fv.durationHrs ? +fv.durationHrs : undefined,
    tags: tagsArray,
    description: fv.description
  };

  if (this.editingCourseId) {
    // ✅ Update existing course (id must be included here)
    this.courseService
      .updateCourse(this.editingCourseId, { ...courseData, id: this.editingCourseId })
      .subscribe(() => {
        this.courseForm.reset();
        this.loadCourses();
      });
  } else {
    // ✅ Add new course (let json-server auto-generate id)
    this.courseService.addCourse(courseData as Course).subscribe(() => {
      this.courseForm.reset();
      this.loadCourses();
    });
  }
}

  // ✅ delete course
  remove(courseId: number) {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.message = '🗑 Course deleted successfully';
        this.loadCourses();
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Failed to delete course';
      }
    });
  }

  // ✅ edit course
  edit(course: Course) {
    this.editingCourseId = course.id;
    this.courseForm.patchValue({
      title: course.title,
      instructorId: course.instructorId,
      domain: course.domain,
      level: course.level,
      durationHrs: course.durationHrs,
      tags: course.tags?.join(', '),
      description: course.description
    });
  }
}
