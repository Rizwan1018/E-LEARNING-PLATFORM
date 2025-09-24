// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { StudentRoutingModule } from './student-routing.module';

// // import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
// // import { CourseListComponent } from './course-list/course-list.component';
// // import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';

// @NgModule({
//   declarations: [
//     // StudentDashboardComponent,
//     // CourseListComponent,
//     // MyEnrollmentsComponent
//   ],
//   imports: [
//     CommonModule,
//     FormsModule,
//     StudentRoutingModule
//   ]
// })
// export class StudentModule {}
// src/app/modules/student/student.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentRoutingModule } from './student-routing.module';

import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { StudentNotificationsComponent } from './student-notifications/student-notifications.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    CourseListComponent,
    CoursePlayerComponent,
    MyEnrollmentsComponent,
    StudentNotificationsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    StudentRoutingModule]
})
export class StudentModule {}