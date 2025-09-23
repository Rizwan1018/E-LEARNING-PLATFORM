import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { AssessmentService } from '../../services/assessment.service';
// import { Assessment } from '../../models/assessment.model';

import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment';


import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-student-assessment',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="container mt-4" *ngIf="assessment">
//       <h2>{{ assessment.title }}</h2>
//       <p>{{ assessment.description }}</p>

//       <form (ngSubmit)="submit()">
//         <div *ngFor="let q of assessment.questions; let i = index" class="mb-3">
//           <h5>{{ i + 1 }}. {{ q.text }}</h5>
//           <div *ngFor="let opt of q.options; let j = index">
//             <label>
//               <input
//                 type="radio"
//                 [(ngModel)]="answers[i]"
//                 name="q{{ i }}"
//                 [value]="j"
//               />
//               {{ opt }}
//             </label>
//           </div>
//         </div>
//         <button type="submit" class="btn btn-success">Submit</button>
//       </form>

//       <div *ngIf="score !== null" class="mt-3 alert alert-info">
//         Your Score: {{ score }} / {{ assessment.questions.length }}
//       </div>
//     </div>
//   `,
// })
// export class StudentAssessmentComponent implements OnInit {
//   assessment!: Assessment;
//   answers: number[] = [];
//   score: number | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private service: AssessmentService
//   ) {}

//   // ngOnInit() {
//   //   const id = Number(this.route.snapshot.paramMap.get('id'));
//   //   this.service.getAssessment(id).subscribe((a) => {
//   //     this.assessment = a;
//   //     this.answers = new Array(a.questions.length).fill(-1);
//   //   });
//   // }


  
// // ngOnInit() {
// //   const idParam = this.route.snapshot.paramMap.get('id');
// //   const id = idParam ? Number(idParam) : null;

// //   if (id === null || isNaN(id)) {
// //     console.error('Invalid assessment ID');
// //     return;
// //   }

// //   this.service.getAssessment(id).subscribe((a) => {
// //     this.assessment = a;
// //     this.answers = new Array(a.questions.length).fill(-1);
// //   });
// // }

// ngOnInit() {
//     // Get the ID as a string and pass it directly to the service
//     const id = this.route.snapshot.paramMap.get('id');
//     console.log(id);

//     if (id) {
//       this.service.getAssessment(id).subscribe((a) => {
//         this.assessment = a;
//         this.answers = new Array(a.questions.length).fill(-1);
//       });
//     }
//   }



//   submit() {
//     let correct = 0;
//     this.assessment.questions.forEach((q, i) => {
//       if (this.answers[i] === q.correctAnswer) correct++;
//     });
//     this.score = correct;
//   }

// }


//==
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
