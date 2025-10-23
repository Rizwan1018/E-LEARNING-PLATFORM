import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { CourseManagementComponent } from '../pages/course-management/course-management.component';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor (private router:Router, private auth: AuthService){}


  logout():void{
    this.auth.logout();
    this.router.navigate(['login']);
  }
  login():void{
    this.router.navigate(['login']);

    
  }
  signup(){
        this.router.navigate(['signup']);

  }

}
