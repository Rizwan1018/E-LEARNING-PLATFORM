// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { InstructorRoutingModule } from './instructor-routing.module';

// // import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
// // import { AddCourseComponent } from './add-course/add-course.component';
// // import { ViewEnrollmentsComponent } from './view-enrollments/view-enrollments.component';

// @NgModule({
//   declarations: [
//     // InstructorDashboardComponent,
//     // AddCourseComponent,
//     // ViewEnrollmentsComponent
//   ],
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,   // ✅ THIS FIXES [formGroup] error
//     RouterModule,
//     InstructorRoutingModule
//   ]
// })
// export class InstructorModule {}

// src/app/modules/instructor/instructor.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ViewEnrollmentsComponent } from './view-enrollments/view-enrollments.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    InstructorDashboardComponent,
    AddCourseComponent,
    ViewEnrollmentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InstructorRoutingModule,
    SharedModule
]
})
export class InstructorModule {}