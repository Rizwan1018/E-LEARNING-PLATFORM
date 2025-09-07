import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';
import { Student } from '../../../models/student';

@Component({
  selector: 'app-view-enrollments',
  standalone: false,
  templateUrl: './view-enrollments.component.html',
  styleUrl: './view-enrollments.component.css'
})
export class ViewEnrollmentsComponent implements OnInit {
  courses: Course[] = [];
  studentsMap = new Map<number, Student>();
  selectedCourseId?: number;
  enrollments: Enrollment[] = [];

  constructor(private catalog: CatalogService, private enrollSvc: EnrollmentService) {}

  ngOnInit() {
    this.catalog.getCourses({}).subscribe(cs => this.courses = cs);
    this.catalog.getStudents().subscribe(ss => ss.forEach(s => this.studentsMap.set(s.id, s)));
  }

  load() {
    if (!this.selectedCourseId) return;
    this.enrollSvc.getEnrollmentsByCourse(this.selectedCourseId).subscribe(e => this.enrollments = e);
  }
}