// src/app/modules/student/student-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';
import { CoursePlayerComponent } from './course-player/course-player.component';

const routes: Routes = [
  { path: '', component: StudentDashboardComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'enrollments', component: MyEnrollmentsComponent },
  { path: 'player/:courseId', component: CoursePlayerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}