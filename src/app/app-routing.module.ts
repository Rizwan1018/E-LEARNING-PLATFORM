import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponentComponent } from './modules/authentication/login-component/login-component.component';
import { SignupComponent } from './modules/authentication/signup/signup.component';
import { authGuard } from './modules/authentication/auth/instructorauth.guard';
import { studentGuard } from './modules/authentication/auth/studentauth.guard';
// If you plan to add a dedicated HomeComponent, import from ./modules/home/home.component
// For now we just redirect '' to student-dashboard
const routes: Routes = [
  {path:'', component:LandingComponent},
  { path: 'home', component: HomeComponent },
  { path: 'instructor', loadChildren: () => import('./modules/instructor/instructor.module').then(m => m.InstructorModule), canActivate:[authGuard] },
  {path:'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule), canActivate:[studentGuard]},    
   {path: 'login', component:LoginComponentComponent },
  { path:'signup', component:SignupComponent  },
     { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
