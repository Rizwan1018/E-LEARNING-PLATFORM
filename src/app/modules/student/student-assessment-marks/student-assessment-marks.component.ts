
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssessmentAttemptService, StudentAttemptSummary } from '../../../services/assessment-attempt.service';

@Component({
  selector: 'app-student-assessment-marks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './student-assessment-marks.component.html'
})
export class StudentAssessmentMarksComponent implements OnInit {
  attempts: StudentAttemptSummary[] = [];
  loading = true;
  errorMsg: string | null = null;

  constructor(private attemptService: AssessmentAttemptService) {}

  ngOnInit(): void {
    this.attemptService.getMyAttempts().subscribe({
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

  trackByA = (_: number, a: StudentAttemptSummary) => a.assessmentId;
}
