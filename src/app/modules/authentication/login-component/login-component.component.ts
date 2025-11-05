
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

  

  // loginForm!: FormGroup;

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private authService: AuthService, 
  //   private router: Router
  // ) {}

  // ngOnInit(): void {
  //   this.loginForm = this.formBuilder.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required]]
  //   });
  // }

  // login(): void {
  //   if (this.loginForm.valid) {
  //     this.authService.login(this.loginForm.value).subscribe({
  //       next: (response) => {
  //         // alert('Login successful!');
  //         const successModal = new bootstrap.Modal(document.getElementById('statusSuccessModal'));
  //          successModal.show();

  //         console.log('Response:', response);

  //      //   localStorage.setItem('user', JSON.stringify(response));
          
  //         if (response.role === 'STUDENT') {
  //           this.router.navigate(['student'], { queryParams: { id: response.id } });
  //         } else if (response.role === 'INSTRUCTOR') {
  //           this.router.navigate(['instructor'], { queryParams: { id: response.id } });
  //         } else {
  //           this.router.navigate(['home']);
  //         }
  //       },
  //       error: (err) => {
  //         console.log(err)
  //         // alert('Invalid credentials');
  //         const errorModal = new bootstrap.Modal(document.getElementById('statusErrorsModal'));
  //          errorModal.show();

  //       }
  //     });
  //   }
  // }

  // get f() {
  //   return this.loginForm.controls;
  // }

  
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
        console.log('Login response:', response);

        const modalEl = document.getElementById('statusSuccessModal');
        if (modalEl) {
          const successModal = new bootstrap.Modal(modalEl);
          successModal.show();

          // Wait for user to click "Ok"
          const okBtn = document.getElementById('successModalOkBtn');
          if (okBtn) {
            okBtn.addEventListener('click', () => {
              if (response.role === 'STUDENT') {
                this.router.navigate(['student'], { queryParams: { id: response.id } });
              } else if (response.role === 'INSTRUCTOR') {
                this.router.navigate(['instructor'], { queryParams: { id: response.id } });
              } else {
                this.router.navigate(['home']);
              }
            }, { once: true }); // ensures listener runs only once
          }
        }
      },
      error: (err) => {
        console.error('Login error:', err);

        const errorEl = document.getElementById('statusErrorsModal');
        if (errorEl) {
          const errorModal = new bootstrap.Modal(errorEl);
          errorModal.show();
        }
      }
    });
  }
}


  get f() {
    return this.loginForm.controls;
  }
}


