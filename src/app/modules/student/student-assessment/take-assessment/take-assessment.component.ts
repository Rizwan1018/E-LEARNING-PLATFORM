
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { AssessmentService } from '../../../../services/assessment.service';
import { Assessment, Question } from '../../../../models/assessment';
import { AssessmentAttemptService } from '../../../../services/assessment-attempt.service';

@Component({
  selector: 'app-take-assessment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-assessment.component.html',
  styleUrls: ['./take-assessment.component.css']
})
export class TakeAssessmentComponent implements OnInit {
  assessmentId!: number;
  assessment: Assessment | null = null;

  // answers keyed by questionId
  studentAnswers: { [questionId: number]: number } = {};

  submitInFlight = false;

  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private attemptService: AssessmentAttemptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idStr = params.get('id');
        if (!idStr) return [];
        const id = Number(idStr);
        this.assessmentId = id;
        return this.assessmentService.getAssessment(id.toString());
      })
    ).subscribe({
      next: (data: any) => {
        this.assessment = data;
        if (!Array.isArray(this.assessment?.questions)) {
          this.assessment!.questions = [];
        }
      },
      error: (err: HttpErrorResponse)=> {
        console.error('Failed to load assessment', err);
        alert('Failed to load assessment.');
      }
    } as any);
  }

  onAnswerSelected(question: Question, optionIndex: number): void {
    if (!question.id && question.id !== 0) {
      console.warn('Question ID is missing; ensure backend returns question.id');
      return;
    }
    this.studentAnswers[question.id!] = optionIndex;
  }

  submitAssessment(): void {
    if (!this.assessment?.id) return;

    this.submitInFlight = true;
    this.attemptService.postAttempt({
      assessmentId: this.assessment.id!,
      answers: this.studentAnswers
    }).subscribe({
      next: res => {
        this.submitInFlight = false;
        alert(`Submitted! Score: ${res.score}/${res.totalQuestions}`);
        this.router.navigate(['student/assessment-marks']); 
      },
      error: err => {
        this.submitInFlight = false;
        console.error('Submit failed', err);
        alert(err?.error?.message || 'Submit failed');
      }
    });
  }

  trackByQ = (_: number, q: Question) => q.id ?? _;
}
