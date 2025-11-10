import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AssessmentService } from '../../../../services/assessment.service';
import { Assessment } from '../../../../models/assessment';

@Component({
  selector: 'app-teacher-assessment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-assessment-list.html'
})
export class TeacherAssessmentListComponent implements OnInit {
  assessments: Assessment[] = [];

  constructor(private service: AssessmentService, private router: Router) {}

  ngOnInit():void {
    this.load();
  }


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

deleteAssessment(a: Assessment): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
    
      this.service.deleteAssessment(a.id!.toString()).subscribe(() => {
        this.load();
      });
    }
  }

  
viewMarks(a: Assessment) {
  this.router.navigate(['instructor/teacher/assessments', a.id, 'marks']);
}

}
