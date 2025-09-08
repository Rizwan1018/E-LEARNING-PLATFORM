import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Course } from '../models/course';
import { Student } from '../models/student';
import { Instructor } from '../models/instructor';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private api: ApiService) {}

  getCourses(filter?: { search?: string; domain?: string; level?: string; instructorId?: number }): Observable<Course[]> {
    const params: any = {};
    if (filter?.search) params.q = filter.search;
    if (filter?.domain) params.domain = filter.domain;
    if (filter?.level) params.level = filter.level;
    if (filter?.instructorId) params.instructorId = filter.instructorId;
    return this.api.get<Course[]>('courses', params);
  }

  getCourse(id: number) { return this.api.get<Course>(`courses/${id}`); }
  createCourse(c: Course) { return this.api.post<Course>('courses', c); }
  updateCourse(c: Course) { return this.api.put<Course>(`courses/${c.id}`, c); }
  deleteCourse(id: number) { return this.api.delete<void>(`courses/${id}`); }

  getStudents() { console.log( this.api.get<Student[]>('students'));
    return this.api.get<Student[]>('students'); }
  getInstructors() { return this.api.get<Instructor[]>('instructors'); }
}
