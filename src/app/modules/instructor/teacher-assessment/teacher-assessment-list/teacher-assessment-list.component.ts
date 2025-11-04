import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AssessmentService } from '../../../../services/assessment.service';
import { Assessment } from '../../../../models/assessment';

@Component({
  selector: 'app-teacher-assessment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Teacher - Assessments</h2>
      <button class="btn btn-primary mb-3" (click)="add()">
        Add Assessment for Student
      </button>
      <table class="table table-bordered" *ngIf="assessments.length > 0">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
        <tr *ngFor="let a of assessments">
          <td>{{ a.title }}</td>
          <td>{{ a.description }}</td>
          <td>
            <button class="btn btn-sm btn-info" (click)="edit(a)">Edit</button>
            <button class="btn btn-sm btn-danger" (click)="deleteAssessment(a)">
              Delete
            </button>
          </td>
        </tr>
      </table>
    </div>
  `,
})
export class TeacherAssessmentListComponent implements OnInit {
  assessments: Assessment[] = [];

  constructor(private service: AssessmentService, private router: Router) {}

  ngOnInit():void {
    this.load();
  }

  // load() {
  //   this.service.getAssessments().subscribe((d) => (this.assessments = d));
  // }

   load(): void {
    this.service.getAssessments().subscribe((assessments) => {
      this.assessments = assessments;
    });
  }

  add() {
    this.router.navigate(['instructor/teacher/assessments/new']);
  }

  
edit(a: Assessment) {
  if (!a.id) { alert('Missing assessment id'); return; }
  this.router.navigate(['instructor', 'teacher', 'assessments', a.id]);
}


  
// edit(a: Assessment) {
//   this.router.navigate(['/teacher/assessments', a.id]);
// }

  // edit(a: Assessment) {
  //   this.router.navigate(['/teacher/assessments', a.id, 'edit']);
  // }
  // delete(a: Assessment) {
  //   if (confirm('Delete this assessment?'))
  //     this.service.deleteAssessment(a.id!).subscribe(() => this.load());
  // }

//   deleteAssessment(a: Assessment) {
//   if (confirm('Are you sure?')) {
//     // Pass the string 'id' directly to the service
//     this.service.deleteAssessment(a.id!).subscribe(() => this.load());
//   }
// }

deleteAssessment(a: Assessment): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
      // Pass the string 'id' directly to the service
      // a.id is already a string, no conversion needed
      this.service.deleteAssessment(a.id!).subscribe(() => {
        // Reload the list after successful deletion
        this.load();
      });
    }
  }
}
