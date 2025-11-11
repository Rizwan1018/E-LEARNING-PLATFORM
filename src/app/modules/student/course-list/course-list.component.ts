import { Component, OnInit, NgZone } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { CatalogService } from '../../../services/catalog.service';
import { PaymentService } from '../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var Razorpay: any; // ✅ Razorpay global declaration

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses: Course[] = [];
  selectedStudentId = 0;
  search = '';
  message = '';
  showPopup = false;

  // payment related
  course: any;
  showModal = false;
  selectedCourse: any;
  isProcessing = false;
  paymentSuccess = false;
  transactionId = '';

  constructor(
    private courseService: CatalogService,
    private enrollSvc: EnrollmentService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private ngZone : NgZone
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && String(user.role).toUpperCase() === 'STUDENT') {
      this.selectedStudentId = Number(user.id);
    }
    this.load();

    // optional: load course by id (if route param exists)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get(`http://localhost:8080/api/courses/${id}`).subscribe({
        next: (res) => (this.course = res),
        error: (err) => console.error(err)
      });
    }
  }

  load(): void {
    const studentId = this.selectedStudentId ? this.selectedStudentId : undefined;
    this.courseService.getCourses({ search: this.search }, studentId)
      .subscribe({
        next: (data) => {
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
        this.showPopup = true;
        this.load();
      },
      error: (err) => {
        console.error(err);
        alert('Enrollment failed. Please try again.');
      }
    });
  }

  closePopup() {
    this.showPopup = false;
  }

  // ✅ open modal before confirming payment
  confirmPurchase(course: any) {
    if (!course || !course.id) {
      console.error('Invalid course object:', course);
      alert('Error: Invalid course data');
      return;
    }
    this.selectedCourse = { ...course };
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  cancelPayment() {
    this.showModal = false;
  }

  // ✅ Payment Logic (Razorpay + Backend)
  async makePayment() {
  const userRaw = localStorage.getItem('user');
  if (!userRaw || !this.selectedCourse) {
    alert('Please select a course and login!');
    return;
  }

  const user = JSON.parse(userRaw);
  const studentId = user.id;
  const courseId = this.selectedCourse.id;

  this.isProcessing = true;

  this.paymentService.processPayment(499).subscribe({
    next: (order: any) => {
      const options = {
        key: 'rzp_test_RdGkzD23qpCkc7', // Test key
        amount: order.amount,
        currency: 'INR',
        name: 'INCO Learn',
        description: this.selectedCourse.title,
        order_id: order.orderId,

        handler: (response: any) => {
            this.ngZone.run(() => {
          console.log('✅ Razorpay success:', response);

          // Stop loader immediately
          this.isProcessing = false;

          // Enroll the student after successful payment
          this.enroll(courseId);

          // Update UI
          this.paymentSuccess = true;
          this.transactionId = response.razorpay_payment_id;

          // Hide modal after short delay
          setTimeout(() => {
            this.showModal = false;
            document.body.style.overflow = 'auto';
          }, 800);

          this.load();
         }); // refresh courses
        },

        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#5624d0' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', (response: any) => {
        console.error('❌ Payment failed:', response.error);
        this.isProcessing = false;
        alert('Payment failed. Please try again.');
        this.showModal = false;
      });
    },
    error: (err) => {
      console.error('Error creating Razorpay order:', err);
      this.isProcessing = false;
      this.showModal = false;
      alert('Failed to initialize payment.');
    },
  });
}



  // ✅ Load Razorpay script dynamically
  loadRazorpayScript() {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
}
