// src/app/modules/student/my-enrollments/my-enrollments.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CatalogService } from '../../../services/catalog.service';
import { Enrollment } from '../../../models/enrollment';
import { Course } from '../../../models/course';
import { StudentContextService } from '../../../services/student-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-enrollments',
  templateUrl: './my-enrollments.component.html',
  standalone:false,
  styleUrls: ['./my-enrollments.component.css']
})
export class MyEnrollmentsComponent implements OnInit, OnDestroy {
  studentId: number | null = null;
  enrollments: Enrollment[] = [];
  coursesById = new Map<number, Course>();
  students = []; // not used for selection now

  private sub = new Subscription();

  constructor(
    private enrollSvc: EnrollmentService,
    private catalog: CatalogService,
    private studentContext: StudentContextService
  ) {}

  ngOnInit(): void {
    // watch selected student
    const s = this.studentContext.studentId$.subscribe(id => {
      this.studentId = id;
      this.load();
    });
    this.sub.add(s);

    // load course map once (or you may reload each time if your data changes)
    const s2 = this.catalog.getCourses({}).subscribe(cs => {
      cs.forEach(c => this.coursesById.set(c.id, c));
    });
    this.sub.add(s2);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  load() {
    if (!this.studentId) {
      this.enrollments = [];
      return;
    }
    this.enrollSvc.getEnrollmentsByStudent(this.studentId).subscribe(list => {
      this.enrollments = list;
    });
  }
}