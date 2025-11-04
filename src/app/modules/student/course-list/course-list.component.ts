import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-course-list',
  standalone:false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  selectedStudentId = 0;
  search = '';
  message = '';
  showPopup = false; // ✅ new variable

  constructor(
    private courseService: CatalogService,
    private enrollSvc: EnrollmentService,
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.selectedStudentId = Number(user.id);
    }
    this.load();
  }

  load(): void {
    // pass studentId so backend returns enrolled flag
    const studentId = this.selectedStudentId ? this.selectedStudentId : undefined;
    this.courseService.getCourses({ search: this.search }, studentId)
      .subscribe({
        next: (data) => {
          // normalize and add displayTags
          this.courses = (Array.isArray(data) ? data : []).map((c: any) => ({
            ...c,
            displayTags: typeof c.tags === 'string'
              ? c.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
              : Array.isArray(c.tags) ? c.tags : [],
            enrolled: !!c.enrolled
          }));
        },
        error: (err) => {
          console.log('Error loading the courses', err);
          this.courses = [];
        }
      });
  }

   enroll(courseId: number) {
    if (!this.selectedStudentId) {
      alert('Please login as a student');
      return;
    }
    this.enrollSvc.enroll(this.selectedStudentId, courseId).subscribe({
      next: (res: any) => {
        if (res.success) {
          
          this.showPopup = true;
          // Refresh course list after short delay
          setTimeout(() => this.load(), 1000);
        } else {
          alert(res.message || 'Enrollment failed');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Enrollment failed. Please try again.');
      }
    });
  }

  // ✅ New method to close popup
  closePopup() {
    this.showPopup = false;
  }
}