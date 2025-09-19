

import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Student } from '../../../models/student';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  students: Student[] = [];
  selectedStudentId = 1;
  search = '';
  message = '';

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.catalog.getStudents().subscribe(s => (this.students = s));
    const sid = this.route.snapshot.queryParamMap.get('studentId');
    if (sid) this.selectedStudentId = +sid;
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