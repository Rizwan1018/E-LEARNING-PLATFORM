// src/app/modules/student/student-dashboard/student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Student } from '../../../models/student';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  students: Student[] = [];
  selectedStudentId: number = 1;

  coursesById = new Map<number, Course>();
  enrollments: Enrollment[] = [];

  // stats
  enrolledCount = 0;
  learningHours = 0;
  certificates = 0;
  averageProgress = 0;

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // read studentId from query params if present
    this.route.queryParams.subscribe(qp => {
      const sid = qp['studentId'];
      if (sid) this.selectedStudentId = +sid;
      this.loadStudents(); // load students first, then dashboard
    });
  }

  loadStudents() {
    this.catalog.getStudents().subscribe(sts => {
      this.students = sts;
      // ensure selectedStudentId is valid
      if (!this.selectedStudentId && this.students.length) {
        this.selectedStudentId = this.students[0].id;
      }
      this.loadDashboard();
    });
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
      // populate coursesById map
      this.coursesById.clear();
      courses.forEach(c => { this.coursesById.set(Number(c.id), c)});

      // enrich enrollments with course object
      this.enrollments = (enrollments || []).map(e => ({
        ...e,
        course: this.coursesById.get(Number(e.courseId))
      }));

      this.computeStats();
    }, err => {
      console.error('loadDashboard error', err);
    });
  }
  computeStats() {
    this.enrolledCount = this.enrollments.length;
    this.learningHours = this.enrollments.reduce((sum, e) => {
      const dur = this.coursesById.get(e.courseId)?.durationHrs ?? 0;
      return sum + dur;
    }, 0);

    // certificates field not present in our db.json — leave 0 or compute if you add
    this.certificates = 0;

    this.averageProgress = this.enrollments.length
      ? Math.round(this.enrollments.reduce((s, e) => s + (e.progress ?? 0), 0) / this.enrollments.length)
      : 0;
  }

  // when dropdown is changed
  onStudentChange() {
    // reflect change in URL so browse & enroll links carry current student
    this.router.navigate([], { queryParams: { studentId: this.selectedStudentId } });
    this.loadDashboard();
  }

  // helper to get course for an enrollment quickly in template
  courseFor(e: Enrollment): Course | undefined {
    console.log(this.coursesById.get(Number(e.courseId)));
    return this.coursesById.get(Number(e.courseId));
  }
}