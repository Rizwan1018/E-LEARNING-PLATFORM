// src/app/modules/student/course-list/course-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Student } from '../../../models/student';
import { StudentContextService } from '../../../services/student-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  standalone:false,
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  students: Student[] = [];
  selectedStudentId: number | null = null;
  search = '';
  domain = '';
  level = '';
  message = '';

  domains = ['Web', 'Frontend', 'CS Core'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  private sub = new Subscription();

  constructor(private catalog: CatalogService, private enrollSvc: EnrollmentService, private studentContext: StudentContextService) {}

  ngOnInit() {
    const s1 = this.catalog.getStudents().subscribe(s => this.students = s);
    this.sub.add(s1);

    // watch for selected student
    const s2 = this.studentContext.studentId$.subscribe(id => {
      this.selectedStudentId = id;
    });
    this.sub.add(s2);

    this.load();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  load() {
    this.catalog.getCourses({ search: this.search, domain: this.domain, level: this.level })
      .subscribe(c => this.courses = c);
  }

  enroll(courseId: number) {
    if (!this.selectedStudentId) {
      this.message = 'Please select a student from the dashboard first.';
      return;
    }
    this.message = 'Processing...';
    this.enrollSvc.enroll(this.selectedStudentId, courseId).subscribe((res: any) => {
      this.message = res.success ? '✅ Enrollment successful' : '⚠️ ' + res.message;
    });
  }

  clearFilters() {
    this.search = this.domain = this.level = '';
    this.load();
  }
}