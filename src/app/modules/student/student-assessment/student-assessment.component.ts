import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment';


import { Observable } from 'rxjs';


@Component({
  selector: 'app-student-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
templateUrl: './student-assessment.component.html',
  })
export class StudentAssessmentComponent implements OnInit {

  assessment!: Observable<Assessment[]>;
  constructor(private service:AssessmentService){

  }
  ngOnInit(): void {
    this.assessment= this.service.getAssessments();
  }
  call()
  {
    console.log()
  }
}
