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

  login(){
    this.http.get<any>("http://localhost:3000/users")
    .subscribe(res=>{
      const user=res.find((a:any)=>{
        return a.email === this.loginForm.value.email && a.password===this.loginForm.value.password
      });
      if(user){
        alert("login Success");
        localStorage.setItem('user',JSON.stringify(user));
        if(user.role==='student'){
          console.log("user roll === student")
          this.router.navigate(['student']);
        }else if(user.role==='instructor'){
         this.router.navigate(['instructor']);
        }
        // this.loginForm.reset;l
      }else{
        alert("user not found")
      }
    },err=>{
      alert("Something went wrong")
    })
  }
}
