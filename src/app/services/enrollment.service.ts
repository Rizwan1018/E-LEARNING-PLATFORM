// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Enrollment } from '../models/enrollment';
import { Observable, of, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private api: ApiService) {}

  getEnrollments() {
    return this.api.get<Enrollment[]>('enrollments');
  }

  getEnrollmentsByStudent(studentId: number) {
    return this.api.get<Enrollment[]>('enrollments', { studentId });
  }

  getEnrollmentsByCourse(courseId: number) {
    return this.api.get<Enrollment[]>('enrollments', { courseId });
  }

  enroll(studentId: number, courseId: number) {
    return this.getEnrollments().pipe(
      map(list =>
        list.some(e =>
          Number(e.studentId) === Number(studentId) &&
          Number(e.courseId) === Number(courseId)
        )
      ),
      switchMap(exists => {
        if (exists) {
          return of({ success: false, message: 'Already enrolled' });
        }
        const newEnrollment: Enrollment = {
          studentId,
          courseId,
          enrollmentDate: new Date().toISOString().slice(0, 10),
          progress: 0,
          status: 'enrolled'
        };
        return this.api.post<Enrollment>('enrollments', newEnrollment)
          .pipe(map(data => ({ success: true, message: 'Enrolled', data })));
      })
    );
  }

  updateProgress(id: number, progress: number) {
    return this.api.get<Enrollment>(`enrollments/${id}`).pipe(
      switchMap(e => this.api.put<Enrollment>(`enrollments/${id}`, { ...e, progress }))
    );
  }

  setStatus(id: number, status: string) {
    return this.api.get<Enrollment>(`enrollments/${id}`).pipe(
      switchMap(e => this.api.put<Enrollment>(`enrollments/${id}`, { ...e, status }))
    );
  }
}