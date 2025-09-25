// src/app/modules/instructor/instructor-dashboard/instructor-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { CatalogService } from '../../../services/catalog.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: false,
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  courses: Course[] = [];
  instructorId: number | null = null;

  constructor(private courseService: CourseService, private catalog: CatalogService) { }

  ngOnInit(): void {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (user && user.role === 'instructor') {
      if (user.instructorId) {
        this.instructorId = Number(user.instructorId);
        this.loadCourses();
      } else {
        // map user -> instructor record via email
        this.catalog.getInstructors().subscribe(list => {
          const found = list.find(i => (String(i.email) || '').toLowerCase() === (user.email || '').toLowerCase());
          if (found) {
            this.instructorId = Number(found.id);
            user.instructorId = this.instructorId;
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.loadCourses();
        }, err => {
          console.error('Failed to load instructors', err);
          this.loadCourses();
        });
      }
    } else {
      // not an instructor (for dev) -> load nothing or all
      this.loadCourses();
    }
  }

  loadCourses() {
    if (this.instructorId) {
      this.courseService.getCourses({ instructorId: this.instructorId }).subscribe({
        next: (data) => (this.courses = data),
        error: (err) => console.error(err)
      });
    } else {
      // fallback: load all courses (or none). I keep load-all so dev can still see something.
      this.courseService.getCourses().subscribe({
        next: (data) => (this.courses = data),
        error: (err) => console.error(err)
      });
    }
  }
}
