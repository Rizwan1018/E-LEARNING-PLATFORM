import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AssessmentAttemptService, AssessmentAttemptSummary } from '../../../../services/assessment-attempt.service';

 


@Component({
  selector: 'app-teacher-assessment-marks',
  standalone: false,
  providers: [DatePipe],
  templateUrl: './teacher-assessment-marks.component.html'
})
export class TeacherAssessmentMarksComponent implements OnInit {

  assessmentId!: number;
  attempts: AssessmentAttemptSummary[] = [];
  loading = true;
  errorMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private attemptService: AssessmentAttemptService
  ) {}

  ngOnInit(): void {
    this.assessmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.attemptService.getAttemptsByAssessment(this.assessmentId).subscribe({
      next: data => {
        this.attempts = data;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err?.error?.message || 'Failed to load attempts';
        this.loading = false;
      }
    });
  }

  trackByS = (_: number, a: AssessmentAttemptSummary) => a.studentId;
}
