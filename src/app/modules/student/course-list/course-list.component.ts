import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { CatalogService } from '../../../services/catalog.service';
import { PaymentService } from '../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-course-list',
  standalone:false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  selectedStudentId = 0;
  search = '';
  message = '';
  showPopup = false; // ✅ new variable

  //payment related
   course: any;
  showModal = false;
  selectedCourse: any;
  isProcessing = false;
  paymentSuccess = false;
  transactionId = '';


  constructor(
    private courseService: CatalogService,
    private enrollSvc: EnrollmentService,
    //payment related
    private paymentService : PaymentService,
    private route: ActivatedRoute,
    private http: HttpClient
    
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.selectedStudentId = Number(user.id);
    }
    this.load();

    //payment related
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://localhost:8080/api/courses/${id}`).subscribe({
      next: (res) => (this.course = res),
      error: (err) => console.error(err)
    });

  }

  load(): void {
    // pass studentId so backend returns enrolled flag
    const studentId = this.selectedStudentId ? this.selectedStudentId : undefined;
    this.courseService.getCourses({ search: this.search }, studentId)
      .subscribe({
        next: (data) => {
          // normalize and add displayTags
          this.courses = (Array.isArray(data) ? data : []).map((c: any) => ({
            ...c,
            displayTags: typeof c.tags === 'string'
              ? c.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
              : Array.isArray(c.tags) ? c.tags : [],
            enrolled: !!c.enrolled
          }));
        },
        error: (err) => {
          console.log('Error loading the courses', err);
          this.courses = [];
        }
      });
  }

 enroll(courseId: number) {
  if (!this.selectedStudentId) {
    alert('Please login as a student');
    return;
  }
  this.enrollSvc.enroll(this.selectedStudentId, courseId).subscribe({
    next: (res: any) => {
      const created = res && res.data ? res.data : res;
      this.showPopup = true;
      // Refresh course list after success
      this.load();
    },
    error: (err) => {
      console.error(err);
      alert('Enrollment failed. Please try again.');
    }
  });
}

  // ✅ New method to close popup
  closePopup() {
    this.showPopup = false;
  }


  // Just Testing the payment module
 confirmPurchase(course: any) {
  if (!course || !course.id) {
    console.error('Invalid course object:', course);
    alert('Error: Invalid course data');
    return;
  }

  console.log('Course selected:', course); // ✅ Check in console
  this.selectedCourse = { ...course }; // clone the object
  this.showModal = true;
  document.body.style.overflow = 'hidden'; // lock scroll
}


closeModal() {
  this.showModal = false;
  document.body.classList.remove('modal-open');
}



  cancelPayment() {
    this.showModal = false;
  }

 makePayment() {
  if (!this.selectedCourse || !this.selectedCourse.id) {
    alert('Course not selected properly.');
    return;
  }

  const userRaw = localStorage.getItem('user');
  if (!userRaw) {
    alert('Please login first!');
    return;
  }

  const user = JSON.parse(userRaw);
  const studentId = user.id;
  const courseId = this.selectedCourse.id;

  this.isProcessing = true;

  setTimeout(() => {
    this.paymentService.processPayment(studentId, courseId).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.paymentSuccess = true;
        this.transactionId = res.transactionId;
      },
      error: (err) => {
        this.isProcessing = false;
        alert('❌ Payment Failed!');
        console.error(err);
      }
    });
  }, 2000);
}
}