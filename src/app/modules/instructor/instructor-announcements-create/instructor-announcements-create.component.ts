import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { NotificationService } from '../../../services/notification.service';
import { Announcement } from '../../../models/announcement';

@Component({
  selector: 'app-instructor-announcements-create',
  standalone: false,
  templateUrl: './instructor-announcements-create.component.html',
  styleUrl: './instructor-announcements-create.component.css'
})
export class InstructorAnnouncementsCreateComponent implements OnInit {
  courses: any[] = [];

  // keep courseId typed as number; start as undefined
  model: Partial<Announcement> = { courseId: undefined, title: '', message: '' };

  // will be set from logged-in user
  instructorId!: number;

  constructor(
    private courseService: CourseService,
    private annService: AnnouncementService,
    private enrollService: EnrollmentService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this.instructorId = user?.id;

    if (!this.instructorId) {
      console.error('No instructor id found in localStorage user');
      return;
    }

    // call the backend route dedicated to instructor courses
    this.courseService.getCoursesByInstructor(this.instructorId).subscribe({
      next: (courses) => this.courses = courses || [],
      error: (err) => { console.error('load courses failed', err); this.courses = []; }
    });
  }

  create(): void {
    if (!this.model.courseId || !this.model.title || !this.model.message) {
      alert('Please fill all fields');
      return;
    }

    const payload: Announcement = {
      courseId: Number(this.model.courseId),
      instructorId: this.instructorId,
      title: this.model.title!.trim(),
      message: this.model.message!.trim(),
      createdAt: new Date().toISOString()
    };

    this.annService.createAnnouncement(payload).subscribe({
      next: () => {
        // Notify enrolled students of this course
        this.enrollService.getEnrollmentsByCourse(payload.courseId as number).subscribe(enrolls => {
          (enrolls || []).forEach(e => {
            this.notifService.createNotification({
              userId: e.studentId,
              courseId: payload.courseId,
              type: 'announcement',
              message: `New announcement: ${payload.title}`,
              createdAt: new Date().toISOString(),
              read: false
            }).subscribe();
          });
        });
        alert('Announcement published.');
        this.model = { courseId: undefined, title: '', message: '' };
      },
      error: (err) => {
        console.error('create announcement failed', err);
        alert('Failed to publish announcement.');
      }
    });
  }
}
