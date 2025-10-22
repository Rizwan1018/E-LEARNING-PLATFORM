import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import{FormGroup,FormBuilder, Validators, AbstractControl} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
    const newUser = this.signupForm.value;
    this.authService.signup(this.signupForm.value).subscribe({
      next: ()=>{
        alert("Signup Successfull");
        this.signupForm.reset();
        this.router.navigate(['/login'])
      },
      error:() =>{
        alert('Sometbhing went wrong')
      }

    });
  }
}


 get f() {
  return this.signupForm.controls;
}
}