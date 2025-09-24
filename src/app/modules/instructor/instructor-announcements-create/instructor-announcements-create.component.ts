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
  model: Partial<Announcement> = { courseId: '', title: '', message: '' };
  instructorId = 1001; // TODO: replace with logged-in instructor id

  constructor(
    private courseService: CourseService,
    private annService: AnnouncementService,
    private enrollService: EnrollmentService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = (courses || []).filter(c => Number(c.instructorId) === this.instructorId);
    });
  }

  create(): void {
    if (!this.model.courseId || !this.model.title || !this.model.message) {
      alert('Please fill all fields');
      return;
    }

    const payload: Announcement = {
      courseId: this.model.courseId!,
      instructorId: this.instructorId,
      title: this.model.title!,
      message: this.model.message!,
      createdAt: new Date().toISOString()
    };

    this.annService.createAnnouncement(payload).subscribe(() => {
      // Notify enrolled students
      this.enrollService.getEnrollmentsByCourse(Number(payload.courseId)).subscribe(enrolls => {
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
      this.model = { courseId: '', title: '', message: '' };
    });
  }
}

