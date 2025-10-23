// src/app/modules/student/course-list/course-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  selectedStudentId = 0;
  search = '';
  message = '';

  constructor(
    private courseService: CourseService,
    private enrollSvc: EnrollmentService,
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'STUDENT') {
      this.selectedStudentId = user.id;
    }
    this.load();
  }

  load(): void {
    this.courseService.getCourses()
      .subscribe({
        next: (data) =>{
          console.log('Raw backend response', data);

          if (typeof data ==='string'){
            try{
              data = JSON.parse(data);
            } catch(e){
              console.error('Invalid JSON format',e)
              data =[];
            }
          }
          if(Array.isArray(data)){
            this.courses = data;
          } else if (data && typeof data === 'object'){
            this.courses = [data];
          } else {
            this.courses = [];
          }

            this.courses = this.courses.map(c => ({
              ...c,
              displayTags:typeof c.tags === 'string'
              ? c.tags.split(',').map(tag => tag.trim()).filter(t=>t)
              : Array.isArray(c.tags) ? c.tags : []
            })) ;
            

          console.log('Final courses array', this.courses);
       //   this.courses = Array.isArray(data) ? data : [data];
        },
        error: (err) => {console.log('Error loading the courses', err)
          this.courses = [];
        }
      });
  }

  enroll(courseId: number) {
    this.message = 'Processing...';
    this.enrollSvc.enroll(this.selectedStudentId, courseId).subscribe((res: any) => {
      this.message = res.success ? 'Enrollment successful' : '!! ' + res.message;
    });
  }
}
