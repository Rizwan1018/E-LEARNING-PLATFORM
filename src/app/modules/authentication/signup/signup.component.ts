import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import{FormGroup,FormBuilder, Validators, AbstractControl} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
declare var bootstrap: any;
@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public signupForm !: FormGroup;
  constructor(private formBuilder:FormBuilder,private http:HttpClient,private router:Router, private authService:AuthService){}

  ngOnInit(): void{
    this.signupForm = this.formBuilder.group({
  fullName: ['', [Validators.required,Validators.pattern(/^[A-Za-z\s]+$/)]],
  email: ['', [Validators.required, Validators.email]],
  mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/)
  ]],
  role:['']
});

  }

 signUp() {
  if (this.signupForm.valid) {
    const newUser = this.signupForm.value;
    console.log(JSON.stringify(newUser) + " signupform");
    newUser.role = newUser.role.toUpperCase();

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        const successModal = new bootstrap.Modal(document.getElementById('statusSuccessModal'));
        successModal.show();

        // Auto-close after 2 seconds
        setTimeout(() => {
          successModal.hide();
          this.router.navigate(['/login']);
        }, 1000);

        this.signupForm.reset();
      },
      error: () => {
        const errorModal = new bootstrap.Modal(document.getElementById('statusErrorsModal'));
        errorModal.show();

        // Auto-close after 2 seconds
        setTimeout(() => {
          errorModal.hide();
        }, 1000);
      }
    });
  }
}



 get f() {
  return this.signupForm.controls;
}
}