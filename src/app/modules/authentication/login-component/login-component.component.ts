
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})

export class LoginComponentComponent implements OnInit {

  

  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // alert('Login successful!');
          new bootstrap.Modal(document.getElementById('statusSuccessModal')).show();
          console.log('Response:', response);

       //   localStorage.setItem('user', JSON.stringify(response));
          
          if (response.role === 'STUDENT') {
            this.router.navigate(['student'], { queryParams: { id: response.id } });
          } else if (response.role === 'INSTRUCTOR') {
            this.router.navigate(['instructor'], { queryParams: { id: response.id } });
          } else {
            this.router.navigate(['home']);
          }
        },
        error: (err) => {
          console.log(err)
          // alert('Invalid credentials');
          new bootstrap.Modal(document.getElementById('statusErrorsModal')).show()
        }
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }
}


