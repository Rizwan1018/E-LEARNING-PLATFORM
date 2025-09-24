import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { StudentContextService } from '../../../services/student-context.service';
import { Notification } from '../../../models/notification';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-notifications',
  standalone: false,
  templateUrl: './student-notifications.component.html',
  styleUrl: './student-notifications.component.css'
})
export class StudentNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  userId: number | null = null;

  constructor(
    private ns: NotificationService,
    private studentCtx: StudentContextService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.studentCtx.getStudentId() ?? 1; // fallback demo user
    this.load();
  }

  load(): void {
    if (this.userId === null) return;
    this.ns.getNotificationsForUser(this.userId).subscribe(res => this.notifications = res || []);
  }

  markRead(n: Notification): void {
    if (!n.id) return;
    this.ns.markAsRead(n.id).subscribe(() => n.read = true);
  }
}

