
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Course } from '../models/course';
import { Student } from '../models/student';
import { Instructor } from '../models/instructor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private api: ApiService) {}

  getCourses(filter?: { search?: string }, studentId?: number) {
  const params: Record<string, any> = {};
  if (studentId !== undefined && studentId !== null) {
    params['studentId'] = studentId;
  }
  // fetch all courses (server will mark enrolled if studentId provided)
  return this.api.get<Course[]>('courses', params).pipe(
    map(courses => {
      if (!Array.isArray(courses)) return [];
      if (filter?.search) {
        const term = filter.search.toLowerCase();
        return courses.filter(c =>
          (c.title || '').toLowerCase().includes(term) ||
          (typeof c.tags === 'string' && c.tags.toLowerCase().includes(term))
        );
      }
      return courses;
    })
  );
}


  getCourse(id: number) { return this.api.get<Course>(`courses/${id}`); }
  createCourse(c: Course) { return this.api.post<Course>('courses', c); }
  updateCourse(c: Course) { return this.api.put<Course>(`courses/${c.id}`, c); }
  deleteCourse(id: number) { return this.api.delete<void>(`courses/${id}`); }

  getStudents() { console.log( this.api.get<Student[]>('students'));
    return this.api.get<Student[]>('students'); }
  getInstructors() { return this.api.get<Instructor[]>('instructors'); }
}
