import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Student } from '../../../models/student';
@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  students: Student[]=[];
  selectedStudentId = 1;
  search = '';
  domain = '';
  level = '';
  message = '';

  domains = ['Web', 'Frontend', 'CS Core'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(private catalog: CatalogService, private enrollSvc: EnrollmentService) {}

  ngOnInit() {
    this.catalog.getStudents().subscribe(s => this.students = s);
    this.load();
  }

  load() {
    this.catalog.getCourses({ search: this.search, domain: this.domain, level: this.level })
      .subscribe(c => this.courses = c);
  }

  enroll(courseId: number) {
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
