import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: false,
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css'
})
export class InstructorDashboardComponent implements OnInit {
  
  courses : Course[]= [];

    constructor(private courseService:CourseService){ }

    ngOnInit():void{
      this.loadCourses();
    }

    loadCourses(){
      this.courseService.getCourses().subscribe({
        next:(data) => (this.courses = data)
      })
    }
  }

