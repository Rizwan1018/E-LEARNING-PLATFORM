import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Student } from '../../../models/student';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  students: Student[] = [];
  selectedStudentId: number = 0;
   selectedStudentName!:string;

  coursesById = new Map<number, Course>();
  enrollments: (Enrollment & { course?: Course })[] = [];

  // stats
  enrolledCount = 0;
  learningHours = 0;
  certificates = 0;
  averageProgress = 0;

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.selectedStudentId = user.id;
      this.selectedStudentName = user.fullName;
    }
    this.loadDashboard();
  }

  loadDashboard() {
    if (!this.selectedStudentId) {
      this.enrollments = [];
      this.coursesById.clear();
      this.computeStats();
      return;
    }

    forkJoin({
      courses: this.catalog.getCourses({}),
      enrollments: this.enrollSvc.getEnrollmentsByStudent(this.selectedStudentId)
    }).subscribe(({ courses, enrollments }) => {
      this.coursesById.clear();
      courses.forEach(c => this.coursesById.set(Number(c.id), c));

      this.enrollments = (enrollments || []).map(e => ({
        ...e,
        course: this.coursesById.get(Number(e.courseId))
      }));

      this.computeStats();
    });
  }

computeStats() {
  this.enrolledCount = this.enrollments.length;

  // sum of progress (ensure numeric)
  const totalProgress = this.enrollments.reduce((sum, e) => {
    const p = Number((e as any).progress); // defensive cast in case progress is string
    return sum + (isNaN(p) ? 0 : p);
  }, 0);

  this.learningHours = this.enrollments.reduce((sum, e) => {
    const dur = this.coursesById.get(Number(e.courseId))?.durationHrs ?? 0;
    return sum + dur;
  }, 0);

  this.certificates = 0; // same as before

  this.averageProgress = this.enrollments.length ? Math.round(totalProgress / this.enrollments.length) : 0;
}


  // helper for template
  courseFor(e: Enrollment): Course | undefined {
    return this.coursesById.get(Number(e.courseId));
  }
}
