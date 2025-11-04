import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable,tap } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://localhost:8080/api/auth";

  constructor(private http:HttpClient, private router: Router) { }

  signup(userData:any) : Observable<any>{
//    console.log("userdata in service "+JSON.stringify(userData))
    return this.http.post(`${this.baseUrl}/signup`, userData)
  }

  login(credentials:any): Observable<any>{
  return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
    tap((response:any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('email', response.email);
      localStorage.setItem('user', JSON.stringify(response));
    })
  );

    
  }

  logout(): void{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.router.navigate(['/login']);
  }

  getToken():string | null {
    return localStorage.getItem('token');
  }

  getRole():string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean{
  return !!localStorage.getItem('token');
}
}