import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ViewEnrollmentsComponent } from './view-enrollments/view-enrollments.component';
import { AssessmentFormComponent } from './teacher-assessment/assessment-form.component';
import { TeacherAssessmentListComponent } from './teacher-assessment/teacher-assessment-list/teacher-assessment-list.component';
import { InstructorAnnouncementsCreateComponent } from './instructor-announcements-create/instructor-announcements-create.component';


const routes: Routes = [
  { path: '', component: InstructorDashboardComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'view-enrollments', component: ViewEnrollmentsComponent },
  // {path: 'add-assessment', component:AssessmentFormComponent},
  {path: 'add-assessment', component:TeacherAssessmentListComponent},
  {path:'teacher/assessments/new', component:AssessmentFormComponent},
   { path: 'announcements/create', component: InstructorAnnouncementsCreateComponent } 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {}
