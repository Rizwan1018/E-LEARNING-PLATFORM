import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ViewEnrollmentsComponent } from './view-enrollments/view-enrollments.component';

const routes: Routes = [
  { path: '', component: InstructorDashboardComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'view-enrollments', component: ViewEnrollmentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {}
