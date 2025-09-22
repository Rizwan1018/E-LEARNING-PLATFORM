import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import{FormGroup,FormBuilder, Validators, AbstractControl} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public signupForm !: FormGroup;
  constructor(private formBuilder:FormBuilder,private http:HttpClient,private router:Router){}

  ngOnInit(): void{
    this.signupForm = this.formBuilder.group({
  fullname: ['', [Validators.required,Validators.pattern(/^[A-Za-z\s]+$/)]],
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
      this.http.post<any>('http://localhost:3000/users', this.signupForm.value)
        .subscribe(res => {
          alert('Signup successful!');
          this.signupForm.reset();
          this.router.navigate(['login']);
        }, err => {
          alert('Something went wrong');
        });
    } else {
      this.signupForm.markAllAsTouched(); // Show all errors
    }
  }

 get f() {
  return this.signupForm.controls;
}
}