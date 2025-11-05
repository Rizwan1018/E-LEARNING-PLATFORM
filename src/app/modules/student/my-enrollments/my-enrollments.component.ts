// src/app/modules/student/my-enrollments/my-enrollments.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CatalogService } from '../../../services/catalog.service';
import { Enrollment } from '../../../models/enrollment';
import { Course } from '../../../models/course';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-enrollments',
  standalone: false,
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.css']
})
export class MyEnrollmentsComponent implements OnInit, OnDestroy {
  studentId: number | null = null;
  enrollments: (Enrollment & { course?: Course })[] = [];
  private sub = new Subscription();

  constructor(
    private enrollSvc: EnrollmentService,
    private catalog: CatalogService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.studentId = user.id;
    }

    this.load();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  load() {
    if (!this.studentId) {
      this.enrollments = [];
      return;
    }

    // Load enrollments + courses in parallel
    this.sub.add(
      forkJoin({
        enrollments: this.enrollSvc.getEnrollmentsByStudent(this.studentId),
        courses: this.catalog.getCourses({})
      }).subscribe(({ enrollments, courses }) => {
        const courseMap = new Map(courses.map(c => [Number(c.id), c]));
        this.enrollments = enrollments.map(e => ({
          ...e,
          course: courseMap.get(Number(e.courseId))
        }));
      })
    );
  }

  continueLearning(courseId: number, enrollmentId: number | undefined) {
  // navigate and pass enrollmentId so CoursePlayer can skip lookup
  this.router.navigate(['student', 'player', Number(courseId)], {
    queryParams: { enrollmentId: enrollmentId }
  });
}
}
