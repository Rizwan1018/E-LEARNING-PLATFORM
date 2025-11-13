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
  this.userService.findAccount(this.email).subscribe({
    next: (response) => {
      this.accountFound = true;
      console.log("next", response);

      const successModal = new bootstrap.Modal(document.getElementById('statusSuccessModal'));
      successModal.show();

      // Auto-close after 1 second and proceed to reset
      setTimeout(() => {
        successModal.hide();
        this.goToReset();
      }, 1000);
    },
    error: (error) => {
      console.log("error", error);

      const errorModal = new bootstrap.Modal(document.getElementById('statusErrorsModal'));
      errorModal.show();

      // Auto-close after 1 second
      setTimeout(() => {
        errorModal.hide();
      }, 1000);
    }
  });
}


  goToReset() {
    this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
  }

}
