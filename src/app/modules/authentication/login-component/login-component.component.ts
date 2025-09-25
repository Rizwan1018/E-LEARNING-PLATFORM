import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import{FormGroup,FormBuilder, Validators, AbstractControl} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  public loginForm!:FormGroup
  constructor(private formbuilder:FormBuilder,private http:HttpClient,private router:Router){}

  ngOnInit():void{
    this.loginForm=this.formbuilder.group({
      email:[''],
      password:['']
    })
  }

  login() {
  this.http.get<any>("http://localhost:3000/users")
    .subscribe(res => {
      const user = res.find((a: any) => {
        return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password;
      });


      if (user) {
        alert("Login Success");


        // 🔑 store only essential session info
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          role: user.role,
          email: user.email
        }));


        // 🔀 redirect based on role, passing ID in query params
        if (user.role === 'student') {
          this.router.navigate(['student'], { queryParams: { studentId: user.id } });
        } else if (user.role === 'instructor') {
          this.router.navigate(['instructor'], { queryParams: { instructorId: user.id } });
        }


      } else {
        alert("User not found");
      }
    }, err => {
      alert("Something went wrong");
    });
}

}
