
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssessmentAttemptRequest {
  assessmentId: number;
  // key: questionId, value: selected option index
  answers: { [questionId: number]: number };
}

export interface AssessmentAttemptResponse {
  assessmentId: number;
  assessmentTitle: string;
  studentId: number;
  studentName?: string;
  score: number;
  totalQuestions: number;
  attemptedAt: string; // ISO
}

export interface StudentAttemptSummary {
  assessmentId: number;
  assessmentTitle: string;
  score: number;
  totalQuestions: number;
  attemptedAt: string;
}

export interface AssessmentAttemptSummary {
  studentId: number;
  studentName?: string;
  score: number;
  totalQuestions: number;
  attemptedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AssessmentAttemptService {
  private baseUrl = 'http://localhost:8080/api/assessment-attempts';

  constructor(private http: HttpClient) {}

  postAttempt(req: AssessmentAttemptRequest): Observable<AssessmentAttemptResponse> {
    return this.http.post<AssessmentAttemptResponse>(this.baseUrl, req);
  }

  getMyAttempts(): Observable<StudentAttemptSummary[]> {
    return this.http.get<StudentAttemptSummary[]>(this.baseUrl);
  }

  getAttemptsByAssessment(assessmentId: number): Observable<AssessmentAttemptSummary[]> {
    return this.http.get<AssessmentAttemptSummary[]>(
      `${this.baseUrl}/by-assessment/${assessmentId}`
    );
  }
}