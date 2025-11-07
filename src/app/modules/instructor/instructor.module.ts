import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { InstructorAnnouncementsCreateComponent } from './instructor-announcements-create/instructor-announcements-create.component';
import { InstructorNavbarComponent } from './instructor-navbar/instructor-navbar.component';

import { AssessmentFormComponent } from './teacher-assessment/assessment-form.component';
@NgModule({
  declarations: [
    AssessmentFormComponent,
    InstructorDashboardComponent,
    AddCourseComponent,
    InstructorAnnouncementsCreateComponent,
    InstructorNavbarComponent,
    
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InstructorRoutingModule,
]
})
export class InstructorModule {}