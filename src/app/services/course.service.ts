import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Course } from '../models/course';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private api: ApiService) {}

  addCourse(course: Course): Observable<Course> {
    return this.api.post<Course>('courses', course);
  }

  getCourses(filter?: Record<string, any>): Observable<Course[]> {
    return this.api.get<Course[]>('courses', filter);
  }

  getCourseById(id: number): Observable<Course> {
    return this.api.get<Course>(`courses/${id}`);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.api.put<Course>(`courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.api.delete<void>(`courses/${id}`);
  }
}
