import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment';

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./assessment-form.component.html',
})
export class AssessmentFormComponent implements OnInit {
  assessment: Assessment = { title: '', description: '', questions: [] };

  constructor(
    private service: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');


    console.log(id);
    
    if (id) {
      this.service.getAssessment(id).subscribe((a) => (this.assessment = a));
    }
  }

  addQuestion() {
    this.assessment.questions.push({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
  }

  removeQuestion(i: number) {
    this.assessment.questions.splice(i, 1);
  }

  save() {
    if (this.assessment.id) {
      this.service
        .updateAssessment(this.assessment)
        .subscribe(() => this.router.navigate(['instructor/add-assessment']));
        
    } else {
      this.service
        .addAssessment(this.assessment)
        .subscribe(() => this.router.navigate(['instructor/add-assessment']));
    }
  }
}
