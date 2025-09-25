// src/app/modules/student/course-list/course-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  selectedStudentId = 0;
  search = '';
  message = '';

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'student') {
      this.selectedStudentId = user.id;
    }
    this.load();
  }

  load() {
    this.catalog.getCourses({ search: this.search })
      .subscribe(c => (this.courses = c));
  }

  enroll(courseId: number) {
    this.message = 'Processing...';
    this.enrollSvc.enroll(this.selectedStudentId, courseId).subscribe((res: any) => {
      this.message = res.success ? '✅ Enrollment successful' : '⚠️ ' + res.message;
    });
  }
}
