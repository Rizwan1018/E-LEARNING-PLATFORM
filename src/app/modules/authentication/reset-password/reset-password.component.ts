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
        // alert('Password reset successful');
         new bootstrap.Modal(document.getElementById('statusSuccessModal')).show();
        this.router.navigate(['/login']);
      },
      error: err => {
        // alert(err.error.message || 'Reset failed')
         new bootstrap.Modal(document.getElementById('statusErrorsModal')).show()
         console.log(err.error)
      }

    });
  }

}
