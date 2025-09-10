import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CatalogService } from '../../../services/catalog.service';
import { Enrollment } from '../../../models/enrollment';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  studentId = 1; // ✅ default student
  enrollments: Enrollment[] = [];
  coursesById = new Map<number, Course>();

  // ✅ dynamic stats
  enrolledCoursesCount = 0;
  totalLearningHours = 0;
  certificatesCount = 0;
  avgProgress = 0;

  constructor(
    private enrollSvc: EnrollmentService,
    private catalog: CatalogService
  ) {}

  ngOnInit(): void {
    // Load all courses once
    this.catalog.getCourses({}).subscribe(cs => {
      cs.forEach(c => this.coursesById.set(c.id, c));
      this.loadStats();
    });
  }

  loadStats() {
    this.enrollSvc.getEnrollmentsByStudent(this.studentId).subscribe(e => {
      this.enrollments = e;

      // Total enrolled courses
      this.enrolledCoursesCount = e.length;

      // Sum of durations
      this.totalLearningHours = e.reduce((sum, enr) => {
        const c = this.coursesById.get(enr.courseId);
        return sum + (c?.durationHrs || 0);
      }, 0);

      // Completed courses
      this.certificatesCount = e.filter(enr => enr.status === 'completed').length;

      // Average progress
      if (e.length > 0) {
        this.avgProgress = Math.round(
          e.reduce((sum, enr) => sum + enr.progress, 0) / e.length
        );
      } else {
        this.avgProgress = 0;
      }
    });
  }
}
