// src/app/modules/student/student-navbar/student-navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-navbar',
  standalone: false,
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent implements OnInit {
  selectedStudentId: number | null = null;
  studentName: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.selectedStudentId = user.id;
      this.studentName = user.fullname || user.email || 'Student';
    }
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
