// src/app/modules/student/student-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';

const routes: Routes = [
  // Dashboard is the parent; courses/enrollments are children and will render inside dashboard's router-outlet
  {
    path: '',
    component: StudentDashboardComponent,
    children: [
      { path: 'courses', component: CourseListComponent },
      { path: 'enrollments', component: MyEnrollmentsComponent },
      // when you go to /student the dashboard displays; no child is shown by default
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}