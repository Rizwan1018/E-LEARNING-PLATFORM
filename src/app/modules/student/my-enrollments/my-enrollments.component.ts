import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CatalogService } from '../../../services/catalog.service';
import { Enrollment } from '../../../models/enrollment';
import { Course } from '../../../models/course';
import { Student } from '../../../models/student';
@Component({
  selector: 'app-my-enrollments',
  standalone: false,
  templateUrl: './my-enrollments.component.html',
  styleUrl: './my-enrollments.component.css'
})
export class MyEnrollmentsComponent implements OnInit {
  studentId = 1;
  students: Student[] = [];
  enrollments: Enrollment[] = [];
  coursesById = new Map<number, Course>();

  constructor(private enrollSvc: EnrollmentService, private catalog: CatalogService) {}

  ngOnInit() {
    this.catalog.getStudents().subscribe(s => this.students = s);
    this.catalog.getCourses({}).subscribe(cs => cs.forEach(c => this.coursesById.set(c.id, c)));
    this.load();
  }

  load() {
    this.enrollSvc.getEnrollmentsByStudent(this.studentId).subscribe(e => this.enrollments = e);
  }
}
