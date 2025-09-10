// src/app/modules/student/student-dashboard/student-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { StudentContextService } from '../../../services/student-context.service';
import { Student } from '../../../models/student';
import { Course } from '../../../models/course';
import { Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  standalone:false,
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  selectedStudentId: number | null = null;

  // stats
  enrolledCount = 0;
  learningHours = 0;
  certificatesCount = 0;
  averageProgress = 0;

  private sub = new Subscription();

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private studentContext: StudentContextService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // load students and pick a default (first)
    const s1 = this.catalog.getStudents().subscribe(studs => {
      this.students = studs || [];
      if (this.students.length && this.studentContext.getStudentId() == null) {
        // set default to first student
        this.selectStudent(this.students[0].id);
      }
    });
    this.sub.add(s1);

    // when selected student changes - recompute stats
    const s2 = this.studentContext.studentId$
      .subscribe(id => {
        this.selectedStudentId = id;
        if (id != null) {
          this.loadStatsForStudent(id);
        } else {
          // reset stats
          this.enrolledCount = 0;
          this.learningHours = 0;
          this.certificatesCount = 0;
          this.averageProgress = 0;
        }
      });
    this.sub.add(s2);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  selectStudent(id: number | null) {
    this.studentContext.setStudentId(id);
  }

  private loadStatsForStudent(studentId: number) {
    // fetch enrollments for the student
    this.enrollSvc.getEnrollmentsByStudent(studentId).pipe(
      // just subscribe inside to join with course list
    ).subscribe(enrollments => {
      this.enrolledCount = enrollments.length;
      this.certificatesCount = enrollments.filter(e => e.status === 'completed').length;
      this.averageProgress = enrollments.length
        ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
        : 0;

      // need course durations - fetch all courses, then sum durations of enrolled courseIds
      this.catalog.getCourses({}).subscribe(courses => {
        const map = new Map<number, Course>();
        courses.forEach(c => map.set(c.id, c));
        this.learningHours = enrollments.reduce((sum, e) => sum + (map.get(e.courseId)?.durationHrs ?? 0), 0);
      });
    });
  }

  // navigation helpers
  goToEnrollments() {
    // navigate relative to /student so target becomes /student/enrollments
    this.router.navigate(['student', 'enrollments']);
  }

  goToCourses() {
    this.router.navigate(['student', 'courses']);
  }
}