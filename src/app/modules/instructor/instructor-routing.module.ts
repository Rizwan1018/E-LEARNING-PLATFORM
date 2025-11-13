import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AssessmentFormComponent } from './teacher-assessment/assessment-form.component';
import { TeacherAssessmentListComponent } from './teacher-assessment/teacher-assessment-list/teacher-assessment-list.component';
import { InstructorAnnouncementsCreateComponent } from './instructor-announcements-create/instructor-announcements-create.component';
import { TeacherAssessmentMarksComponent } from './teacher-assessment/teacher-assessment-marks/teacher-assessment-marks.component';



const routes: Routes = [
  { path: '', component: InstructorDashboardComponent },
  { path: 'insdash', component: InstructorDashboardComponent },
  { path: 'add-course', component: AddCourseComponent },

  // List page
  { path: 'add-assessment', component: TeacherAssessmentListComponent },

  // Form (create/edit)
  { path: 'teacher/assessments/new', component: AssessmentFormComponent },
  { path: 'teacher/assessments/:id', component: AssessmentFormComponent },

  { path: 'announcements/create', component: InstructorAnnouncementsCreateComponent },

  
  { path: 'teacher/assessments/:id/marks', component: TeacherAssessmentMarksComponent },

];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {}
