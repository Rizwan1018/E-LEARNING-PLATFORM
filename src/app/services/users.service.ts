import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:8080/api/auth'; // 🔄 Updated from /users to /auth

  constructor(private http: HttpClient) {}

  // 🔍 Find account by email
  findAccount(email: string): Observable<any> {
    console.log("email " + email);
    console.log("findaccount url ", `${this.baseUrl}/find-account/${email}`);
    return this.http.get(`${this.baseUrl}/find-account/${email}`);
  }

  // 🔐 Reset password
  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/reset-password`, {
      email,
      newPassword,
      confirmPassword
    });
  }
}
