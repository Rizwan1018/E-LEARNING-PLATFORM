// src/app/modules/instructor/instructor-navbar/instructor-navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-navbar',
  standalone: false,
  templateUrl: './instructor-navbar.component.html',
  styleUrls: ['./instructor-navbar.component.css']
})
export class InstructorNavbarComponent implements OnInit {
  instructorId: number | null = null;
  instructorName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'INSTRUCTOR') {
      this.instructorId = user.id;
      this.instructorName = user.fullName || 'Instructor';
    }
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.clear();
    this.router.navigate(['/login']);
    window.location.reload();
  }
}
