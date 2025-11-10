// src/app/modules/student/student-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { StudentAssessmentComponent } from './student-assessment/student-assessment.component';
import { TakeAssessmentComponent } from './student-assessment/take-assessment/take-assessment.component';
import { StudentNotificationsComponent } from './student-notifications/student-notifications.component';
import { PaymentHistoryComponent } from '../payment-history/payment-history.component';

const routes: Routes = [
  { path: '', component: StudentDashboardComponent },
  { path: 'dash', component: StudentDashboardComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'enrollments', component: MyEnrollmentsComponent },
  { path: 'player/:courseId', component: CoursePlayerComponent },
  {path: 'student/assessments', component:StudentAssessmentComponent},
  {path: 'take-assessment/:id', component:TakeAssessmentComponent},
  {path: 'take-assessment', component:TakeAssessmentComponent},
  {path: 'payments', component:PaymentHistoryComponent},
  { path: 'notifications', component: StudentNotificationsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}