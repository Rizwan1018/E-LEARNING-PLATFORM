import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { CourseManagementComponent } from '../pages/course-management/course-management.component';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor (private router:Router){}


  logout():void{
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
  login():void{
    this.router.navigate(['login']);

    
  }
  signup(){
        this.router.navigate(['signup']);

  }

}
