// src/app/modules/student/student-notifications/student-notifications.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { StudentContextService } from '../../../services/student-context.service';
import { Notification } from '../../../models/notification';

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
    // 1) try query param
    const qId = Number(this.route.snapshot.queryParamMap.get('studentId'));
    // 2) fallback to context
    const ctxId = this.studentCtx.getStudentId();
    // 3) fallback to localStorage
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    const storageId = u?.id ?? null;

    this.userId = Number.isFinite(qId) && qId > 0
      ? qId
      : (ctxId ?? storageId);

    // keep the context in sync for other pages
    if (this.userId != null) this.studentCtx.setStudentId(this.userId);

    this.load();
  }

  load(): void {
    if (this.userId === null) return;
    this.ns.getNotificationsForUser(this.userId).subscribe({
      next: res => this.notifications = res || [],
      error: err => {
        console.error('Failed to load notifications', err);
        this.notifications = [];
      }
    });
  }

  markRead(n: Notification): void {
    if (!n.id) return;
    this.ns.markAsRead(n.id).subscribe(() => n.read = true);
  }
}
