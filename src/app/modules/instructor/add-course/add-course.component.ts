// src/app/modules/instructor/add-course/add-course.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { CatalogService } from '../../../services/catalog.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-add-course',
  standalone:false,
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  courseForm!: FormGroup;
  message = '';
  courses: Course[] = [];
  editingCourseId: number | null = null;
  instructorId: number | null = null; // resolved instructor id for logged-in user

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private catalog: CatalogService
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      instructorId: [null, Validators.required],
      domain: ['', Validators.required],
      level: ['', Validators.required],
      durationHrs: [null],
      tags: [''],
      description: [''],
      price: [null],
      rating: [null],
      studentsCount: [null],
      thumbnail: [''],
      videoUrl: ['']
    });

    // Resolve instructor id from logged-in user
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (user && user.role === 'instructor') {
      // if mapping already stored on user, use it
      if (user.instructorId) {
        this.instructorId = Number(user.instructorId);
        this.courseForm.patchValue({ instructorId: this.instructorId });
        this.loadCourses(this.instructorId);
      } else {
        // fetch instructor by email and map
        this.catalog.getInstructors().subscribe(list => {
          const found = list.find(i => (String(i.email) || '').toLowerCase() === (user.email || '').toLowerCase());
          if (found) {
            this.instructorId = Number(found.id);
            this.courseForm.patchValue({ instructorId: this.instructorId });
            // persist mapping on localStorage user for faster lookup next time
            user.instructorId = this.instructorId;
            localStorage.setItem('user', JSON.stringify(user));
            this.loadCourses(this.instructorId);
          } else {
            // fallback: load all courses
            this.loadCourses();
          }
        }, err => {
          console.error('Failed load instructors', err);
          this.loadCourses();
        });
      }
    } else {
      // not logged-in as instructor -> just load all (admin dev mode)
      this.loadCourses();
    }
  }

  loadCourses(instructorId?: number) {
    if (instructorId) {
      this.courseService.getCourses({ instructorId }).subscribe({
        next: (data) => (this.courses = data),
        error: (err) => console.error(err)
      });
    } else {
      this.courseService.getCourses().subscribe({
        next: (data) => (this.courses = data),
        error: (err) => console.error(err)
      });
    }
  }

  OnSubmit() {
    if (!this.courseForm.valid) {
      this.message = 'Please fill required fields.';
      return;
    }

    const fv = this.courseForm.value;
    const tagsArray: string[] = fv.tags
      ? fv.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : [];

    // ensure we use resolved instructorId if available
    const finalInstructorId = this.instructorId ?? (fv.instructorId ? +fv.instructorId : undefined);

    const courseData: Omit<Course, 'id'> = {
      title: fv.title,
      instructorId: Number(finalInstructorId),
      domain: fv.domain,
      level: fv.level,
      durationHrs: fv.durationHrs ? +fv.durationHrs : undefined,
      tags: tagsArray,
      description: fv.description,
      price: fv.price ? +fv.price : undefined,
      rating: fv.rating ? +fv.rating : undefined,
      studentsCount: fv.studentsCount ? +fv.studentsCount : undefined,
      thumbnail: fv.thumbnail,
      videoUrl: fv.videoUrl
    };

    if (this.editingCourseId) {
      this.courseService.updateCourse(this.editingCourseId, courseData).subscribe({
        next: () => {
          this.message = '✏️ Course updated successfully';
          this.courseForm.reset();
          this.editingCourseId = null;
          this.loadCourses(this.instructorId ?? undefined);
        },
        error: (err) => {
          console.error(err);
          this.message = '❌ Failed to update course';
        }
      });
    } else {
      this.courseService.addCourse(courseData as Course).subscribe({
        next: () => {
          this.message = '✅ Course added successfully';
          this.courseForm.reset();
          this.loadCourses(this.instructorId ?? undefined);
        },
        error: (err) => {
          console.error(err);
          this.message = '❌ Failed to add course';
        }
      });
    }
  }

  //✅ delete course
  remove(courseId: number | string) {
    const id = Number(courseId);
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.message = '🗑 Course deleted successfully';
        this.loadCourses(this.instructorId ?? undefined);
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Failed to delete course';
      }
    });
  }

  edit(course: Course) {
    // make sure we only allow editing instructor's own courses (we're already only loading theirs)
    this.editingCourseId = Number(course.id);
    this.courseForm.patchValue({
      title: course.title,
      instructorId: course.instructorId,
      domain: course.domain,
      level: course.level,
      durationHrs: course.durationHrs,
      tags: course.tags?.join(', '),
      description: course.description,
      price: course.price,
      rating: course.rating,
      studentsCount: course.studentsCount,
      thumbnail: course.thumbnail,
      videoUrl: course.videoUrl
    });
  }
}
