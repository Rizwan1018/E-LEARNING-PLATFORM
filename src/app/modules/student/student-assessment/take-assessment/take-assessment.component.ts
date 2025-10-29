import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../../services/assessment.service';
import { switchMap } from 'rxjs/operators';
import { Assessment, Question } from '../../../../models/assessment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-take-assessment',
  imports: [CommonModule],
  templateUrl: './take-assessment.component.html',
  styleUrl: './take-assessment.component.css'
})
export class TakeAssessmentComponent implements OnInit {

  

  assessmentId: string | null = null;
  assessment: Assessment | null = null; // Use the Assessment type

  studentAnswers:{[key:number]:number}={};
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
          // 👈 Call the correct method name: getAssessment()
          return this.assessmentService.getAssessment(this.assessmentId);
        } else {
          // Handle the case where no ID is found (e.g., redirect)
          return [];
        }
      })
    ).subscribe(data => {
      this.assessment = data;
    });
  }

  onAnswerSelected(questionIndex: number, optionIndex: number): void {
    // Store the selected option's index for the given question
    this.studentAnswers[questionIndex] = optionIndex;
    console.log('Student Answers:', this.studentAnswers);
  }
  //  submitAssessment(): void {
  //   // Implement your assessment submission logic here.
  //   // This could involve:
  //   // 1. Collecting the student's answers.
  //   // 2. Sending the answers to a backend API for grading.
  //   // 3. Navigating the student to a results page.
  //   console.log('Assessment submitted!');
  //   alert('Assessment submitted!'); // For demonstration
  //  }

      submitAssessment(): void {
      let score = 0;
      const totalQuestions = this.assessment?.questions.length || 0;

      if (this.assessment && totalQuestions > 0) {
        this.assessment.questions.forEach((question, index) => {
          // Check if the student's answer for this question matches the correct answer
          if (this.studentAnswers[index] === question.correctAnswer) {
            score++;
          }
        });
      }

      // Display the final score
      alert(`Assessment submitted! Your score is: ${score} out of ${totalQuestions}`);

      // TODO: In a more advanced version, you would navigate to a results page
      // this.router.navigate(['/results', this.assessmentId]); 
    }
}
