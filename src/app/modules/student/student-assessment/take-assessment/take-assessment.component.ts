
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../../services/assessment.service';
import { switchMap } from 'rxjs/operators';
import { Assessment } from '../../../../models/assessment';
import { CommonModule } from '@angular/common';

declare var bootstrap: any; // ✅ Needed for Bootstrap Modal JS API

@Component({
  selector: 'app-take-assessment',
  standalone: true, // ✅ Important for standalone component
  imports: [CommonModule],
  templateUrl: './take-assessment.component.html',
  styleUrls: ['./take-assessment.component.css'] // ✅ Correct spelling
})
export class TakeAssessmentComponent implements OnInit {

  assessmentId: string | null = null;
  assessment: Assessment | null = null;
  studentAnswers: { [key: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.assessmentId = params.get('id');
        if (this.assessmentId) {
          return this.assessmentService.getAssessment(this.assessmentId);
        } else {
          return [];
        }
      })
    ).subscribe(data => {
      this.assessment = data;
    });
  }

  onAnswerSelected(questionIndex: number, optionIndex: number): void {
    this.studentAnswers[questionIndex] = optionIndex;
  }

  submitAssessment(): void {
    let score = 0;
    const totalQuestions = this.assessment?.questions.length || 0;

    if (this.assessment && totalQuestions > 0) {
      this.assessment.questions.forEach((question, index) => {
        if (this.studentAnswers[index] === question.correctAnswer) {
          score++;
        }
      });
    }

    // ✅ Update modal content dynamically
    const modalElement = document.getElementById('scoreModal');
    const modalBody = modalElement?.querySelector('.modal-body');
    if (modalBody) {
      modalBody.textContent = `Your score is: ${score} out of ${totalQuestions}`;
    }

    // ✅ Show Bootstrap modal
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

 

  
navigateToAssessments(): void {
  const modalElement = document.getElementById('scoreModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement); // ✅ Get current modal instance
    modal?.hide(); // ✅ Close modal properly
  }

  this.router.navigate(['student/student/assessments']);
}

}
