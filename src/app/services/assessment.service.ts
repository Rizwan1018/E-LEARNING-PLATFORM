import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from '../models/assessment';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AssessmentService {
  //private baseUrl = 'http://localhost:3000/assessments';

  private baseUrl='http://localhost:8080/api/assessments';

  constructor(private http: HttpClient) {}

   getAssessments(): Observable<any[]> {
    return this.http.get<Assessment[]>(this.baseUrl);
  }

  getAssessment(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/${id}`);
  }

  addAssessment(a: Assessment): Observable<Assessment> {
    return this.http.post<Assessment>(this.baseUrl, a);
  }

  updateAssessment(a: Assessment): Observable<Assessment> {
    return this.http.put<Assessment>(`${this.baseUrl}/${a.id}`, a);
  }

  deleteAssessment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
