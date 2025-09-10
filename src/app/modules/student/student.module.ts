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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentRoutingModule } from './student-routing.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@NgModule({
  declarations: [
    StudentDashboardComponent,
    CourseListComponent,
    MyEnrollmentsComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentRoutingModule,
    SharedModule
  ]
})
export class StudentModule {}
