import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponentComponent } from './modules/authentication/login-component/login-component.component';
import { SignupComponent } from './modules/authentication/signup/signup.component';
import { instructorGuard } from './modules/authentication/auth/instructorauth.guard';
import { studentGuard } from './modules/authentication/auth/studentauth.guard';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { SupportComponent } from './modules/support/support.component';
// If you plan to add a dedicated HomeComponent, import from ./modules/home/home.component
// For now we just redirect '' to student-dashboard
const routes: Routes = [
  {path:'', component:LandingComponent},
  { path: 'instructor', loadChildren: () => import('./modules/instructor/instructor.module').then(m => m.InstructorModule), canActivate:[instructorGuard] },
  {path:'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule), canActivate:[studentGuard]},    
   {path: 'login', component:LoginComponentComponent },
  { path:'signup', component:SignupComponent  },
  { path:'aboutus', component:AboutUsComponent  },
  { path:'support', component:SupportComponent  },
     { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
