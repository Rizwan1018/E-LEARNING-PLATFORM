// File: src/app/modules/student/my-enrollments/my-enrollments.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CatalogService } from '../../../services/catalog.service';
import { Enrollment } from '../../../models/enrollment';
import { Course } from '../../../models/course';
import { StudentContextService } from '../../../services/student-context.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-enrollments',
  standalone: false,
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.css']
})
export class MyEnrollmentsComponent implements OnInit, OnDestroy {
  studentId: number | null = null;
  enrollments: Enrollment[] = [];
  coursesById = new Map<number, Course>();

  private sub = new Subscription();

  constructor(
    private enrollSvc: EnrollmentService,
    private catalog: CatalogService,
    private studentContext: StudentContextService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //1. Listen to studentContext
    this.sub.add(this.studentContext.studentId$.subscribe(id => {
      this.studentId = id;
      this.load();
    }));

    //2. Also read from query params if studentContext is empty
    const sid = this.route.snapshot.queryParamMap.get('studentId');
    if(sid){
      this.studentId =+sid;
      this.studentContext.setStudentId(this.studentId);
      this.load();
    }
    //3. Load Courses
    this.sub.add(this.catalog.getCourses({}).subscribe(cs => {
      this.coursesById.clear();
      cs.forEach(c => this.coursesById.set(Number(c.id), c))
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  load() {
    if (!this.studentId) {
      this.enrollments = [];
      return;
    }
    this.enrollSvc.getEnrollmentsByStudent(this.studentId).subscribe(list => {
      this.enrollments = list;
    });
  }

  continueLearning(courseId: number) {
    this.router.navigate(['student', 'player', Number(courseId)]);
  }

  courseTitle(courseId: number) {
    return this.coursesById.get(Number(courseId))?.title || '';
  }

  courseThumb(courseId: number) {
    return this.coursesById.get(Number(courseId))?.thumbnail || ('https://picsum.photos/seed/'+courseId+'/800/450');
  }
}

// File: src/app/modules/student/my-enrollments/my-enrollments.component.ts

// import { Component, OnInit, OnDestroy } from '@angular/core';

// import { EnrollmentService } from '../../../services/enrollment.service';

// import { CatalogService } from '../../../services/catalog.service';

// import { Enrollment } from '../../../models/enrollment';

// import { Course } from '../../../models/course';

// import { StudentContextService } from '../../../services/student-context.service';

// import { Subscription, forkJoin } from 'rxjs';

// import { ActivatedRoute, Router } from '@angular/router';



// @Component({

//   selector: 'app-my-enrollments',

//   standalone: false,

//   templateUrl: './my-enrollments.component.html',

//   styleUrls: ['./my-enrollments.component.css']

// })

// export class MyEnrollmentsComponent implements OnInit, OnDestroy {

//   studentId: number | null = null;

//   enrollments: Array<Enrollment & { course?: Course }> = []; // enrich with course

//   private sub = new Subscription();



//   constructor(

//     private enrollSvc: EnrollmentService,

//     private catalog: CatalogService,

//     private studentContext: StudentContextService,

//     private router: Router,

//     private route: ActivatedRoute

//   ) { }



//   ngOnInit() {

//     // get studentId from context

//     this.sub.add(

//       this.studentContext.studentId$.subscribe(id => {

//         this.studentId = id;

//         this.load();

//       })

//     );

//   }



//   ngOnDestroy() {

//     this.sub.unsubscribe();

//   }



//   load() {

//     if (!this.studentId) {

//       this.enrollments = [];

//       return;

//     }



//     // Load enrollments and courses in parallel

//     forkJoin({

//       enrollments: this.enrollSvc.getEnrollmentsByStudent(this.studentId),

//       courses: this.catalog.getCourses({})

//     }).subscribe(({ enrollments, courses }) => {

//       const courseMap = new Map(courses.map(c => [c.id, c]));

//       this.enrollments = enrollments.map(e => ({

//         ...e,

//         course: courseMap.get(e.courseId)

//       }));

//     });

//   }



//   continueLearning(courseId: number) {

//     this.router.navigate(['student', 'player', courseId]);

//   }

// }

