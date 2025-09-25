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
    if (user && user.role === 'instructor') {
      this.instructorId = user.id;
      this.instructorName = user.fullname || user.email || 'Instructor';
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
