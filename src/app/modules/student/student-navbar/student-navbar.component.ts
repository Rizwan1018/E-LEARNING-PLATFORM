// src/app/modules/student/student-navbar/student-navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-student-navbar',
  standalone: false,
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent implements OnInit {
  selectedStudentId: number | null = null;
  studentName: string = '';
   unreadCount = 0;

  constructor(private router: Router, private ns: NotificationService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.selectedStudentId = user.id;
      this.studentName = user.fullName || 'Student';
      this.refreshUnread();

    }
  }

   refreshUnread() {
    if (!this.selectedStudentId) return;
    this.ns.getUnreadCount(this.selectedStudentId).subscribe({
      next: (listOrCount: any) => {
        // your NotificationService.getUnreadCount currently returns Notification[]; adjust service to return number
        // After we change service, this will be a number:
        this.unreadCount = Number(listOrCount) || 0;
      }
    });
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
