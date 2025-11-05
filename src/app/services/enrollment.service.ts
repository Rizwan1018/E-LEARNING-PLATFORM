// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Enrollment } from '../models/enrollment';
import { Observable, of, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private api: ApiService) {}

  getEnrollments(): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>('enrollments');
  }

  getEnrollmentsByStudent(studentId: number) {
    return this.api.get<Enrollment[]>('enrollments', { studentId });
  }

  getEnrollmentsByCourse(courseId: number) {
    return this.api.get<Enrollment[]>('enrollments', { courseId });
  }

  /**
   * Enroll - calls backend POST /api/enrollments with { studentId, courseId }.
   * Returns the created Enrollment object (as returned by backend).
   */
  enroll(studentId: number, courseId: number) {
    const payload = { studentId, courseId };
    return this.api.post<Enrollment>('enrollments', payload).pipe(
      map(created => ({ success: true, data: created }))
    );
  }

  /**
   * Find enrollment for student+course (helper).
   * Calls backend for student's enrollments and finds matching courseId.
   */
  findEnrollmentForStudent(studentId: number, courseId: number) {
    if (!studentId) return of(null);
    return this.getEnrollmentsByStudent(studentId).pipe(
      map(list => (list || []).find(e => Number(e.courseId) === Number(courseId)) || null)
    );
  }

  /**
   * Mark watched -> PUT /api/enrollments/{id}/watched  (body: optional integer lastWatchedPosition)
   */
  markWatched(enrollmentId: number, lastWatchedPosition?: number) {
    // ApiService.put expects (path, body)
    return this.api.put<Enrollment>(`enrollments/${enrollmentId}/watched`, lastWatchedPosition ?? null);
  }

  /**
   * Mark done -> PUT /api/enrollments/{id}/done
   */
  markDone(enrollmentId: number) {
    return this.api.put<Enrollment>(`enrollments/${enrollmentId}/done`, {});
  }

  /**
   * Set rating -> PUT /api/enrollments/{id}/rating  (body: integer 1..5)
   */
  setRating(enrollmentId: number, rating: number) {
    return this.api.put<Enrollment>(`enrollments/${enrollmentId}/rating`, rating);
  }

  /**
   * Update progress (existing)
   * PUT /api/enrollments/{id}/progress with integer body
   */
  updateProgress(id: number, progress: number) {
    return this.api.put<Enrollment>(`enrollments/${id}/progress`, progress);
  }

  /**
   * setStatus wrapper (existing)
   */
  setStatus(id: number, status: string) {
    return this.api.put<Enrollment>(`enrollments/${id}/status`, status);
  }
}
