import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LandingComponent } from './modules/landing/landing.component';
// If you plan to add a dedicated HomeComponent, import from ./modules/home/home.component
// For now we just redirect '' to student-dashboard
const routes: Routes = [
  {path:'', component:LandingComponent},
  { path: 'home', component: HomeComponent },
  { path: 'instructor', loadChildren: () => import('./modules/instructor/instructor.module').then(m => m.InstructorModule) },
  {path:'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule)},  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
