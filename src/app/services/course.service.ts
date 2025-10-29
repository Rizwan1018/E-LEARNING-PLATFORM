import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
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
//   private getAuthHeaders(): HttpHeaders {
    
//   const token = localStorage.getItem('token');
//   return new HttpHeaders({
//     'Authorization': `Bearer ${token}`
//   });
// }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getCoursesByInstructor(instructorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructor/${instructorId}`);
  }
  

  addCourse(formData: FormData): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, formData);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  updateCourse(id: number, formData: Partial<FormData>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, formData);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
