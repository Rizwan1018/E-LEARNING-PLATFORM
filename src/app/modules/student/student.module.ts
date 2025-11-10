import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentRoutingModule } from './student-routing.module';

import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { StudentNavbarComponent } from './student-navbar/student-navbar.component';
import { StudentNotificationsComponent } from './student-notifications/student-notifications.component';
import { StudentAssessmentMarksComponent } from './student-assessment-marks/student-assessment-marks.component';


@NgModule({
  declarations: [
    StudentDashboardComponent,
    CourseListComponent,
    CoursePlayerComponent,
    MyEnrollmentsComponent,
    StudentNavbarComponent,
    StudentNotificationsComponent,
  ],
  imports: [
    StudentAssessmentMarksComponent,
    CommonModule,
    FormsModule,
    StudentRoutingModule]
})
export class StudentModule {}