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
      this.studentName = user.fullName || 'Student';
    }
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.clear();
    this.router.navigate(['/login']);
    window.location.reload();
  }

  dropdownVisible = false;
hideTimeout: any;

user: any = JSON.parse(localStorage.getItem('user') || '{}');
initials = this.user.fullName?.split(" ").map((x:string)=>x[0]).join("") || 'U';

openDropdown() {
  clearTimeout(this.hideTimeout);
  this.dropdownVisible = true;
}

keepOpen() {
  clearTimeout(this.hideTimeout);
}

closeDropdown() {
  this.hideTimeout = setTimeout(() => {
    this.dropdownVisible = false;
  }, 200);
}

goToProfile(){
  this.router.navigate(['/profile']);
}

}
