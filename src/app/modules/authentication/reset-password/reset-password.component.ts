import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
declare var bootstrap: any;
@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  email = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private route: ActivatedRoute, private userService: UsersService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  resetPassword() {
  this.userService.resetPassword(this.email, this.newPassword, this.confirmPassword).subscribe({
    next: () => {
      const successModal = new bootstrap.Modal(document.getElementById('statusSuccessModal'));
      successModal.show();

      // Auto-close after 1 second and navigate to login
      setTimeout(() => {
        successModal.hide();
        this.router.navigate(['/login']);
      }, 1000);
    },
    error: err => {
      const errorModal = new bootstrap.Modal(document.getElementById('statusErrorsModal'));
      errorModal.show();

      // Auto-close after 1 second
      setTimeout(() => {
        errorModal.hide();
      }, 1000);

      console.log(err.error);
    }
  });
}
}
