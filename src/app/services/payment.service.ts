import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  // 🧾 Process payment for a course
  processPayment(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/process?studentId=${studentId}&courseId=${courseId}`, {});
  }

  // 📜 Get all payments by student
  getPaymentsByStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/student/${studentId}`);
  }
}
