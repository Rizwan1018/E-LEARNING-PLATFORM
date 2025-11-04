import { Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email = '';
  accountFound = false;

  constructor(private userService: UsersService, private router: Router) {}

  searchAccount() {
    this.userService.findAccount(this.email).subscribe(
      next =>{ 
        this.accountFound = true,
        console.log(" next ",next)
          // alert('Account  found')
          new bootstrap.Modal(document.getElementById('statusSuccessModal')).show();
         this.goToReset()
      },
      
      error => {
        // alert('Account not found')
        new bootstrap.Modal(document.getElementById('statusErrorsModal')).show()
        console.log("error ",error )
      }
    );
  }

  goToReset() {
    this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
  }

}
