import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  // 💳 1️⃣ Create Razorpay Order (Used by Razorpay popup flow)
  processPayment(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-order`, null, {
      params: { amount },
    });
  }

  // 📚 2️⃣ Enroll the student after payment success
  processEnrollment(studentId: number, courseId: number): Observable<any> {
    const body = { studentId, courseId };
    return this.http.post(`http://localhost:8080/api/enrollments`, body);
  }

  // 🧾 3️⃣ Old dummy payment (optional fallback)
  // 🔸 Use this only if you want to test without Razorpay
  mockPayment(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/process?studentId=${studentId}&courseId=${courseId}`, {});
  }

  // 📜 4️⃣ Fetch payment history by student
  getPaymentsByStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/student/${studentId}`);
  }
}
