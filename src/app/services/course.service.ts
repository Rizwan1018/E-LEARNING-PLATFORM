import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const token = user?.token;

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getCoursesByInstructor(instructorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructor/${instructorId}`, { headers: this.getAuthHeaders() });
  }
  

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, course, { headers: this.getAuthHeaders() });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, course, { headers: this.getAuthHeaders() });
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
