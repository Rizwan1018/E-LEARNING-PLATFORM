import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
// If you plan to add a dedicated HomeComponent, import from ./modules/home/home.component
// For now we just redirect '' to student-dashboard
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule) },
  { path: 'instructor', loadChildren: () => import('./modules/instructor/instructor.module').then(m => m.InstructorModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
