import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { CatalogService } from '../../../services/catalog.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: false,
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  courses: Course[] = [];
  instructorId: number | null = null;
  InstructorName! : string;

  constructor(private courseService: CourseService, private catalog: CatalogService) { }

  ngOnInit(): void {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (user && user.role === 'INSTRUCTOR') {
        this.instructorId = Number(user.id);
        this.InstructorName = user.fullName;
        this.loadCourses();
    }
  }

  loadCourses() {
    if (this.instructorId) {
      this.courseService.getCoursesByInstructor(this.instructorId).subscribe({
        next: (data) => {this.courses = data},
        error: (err) =>{ console.error(err)}
      });
    } 
  }

}