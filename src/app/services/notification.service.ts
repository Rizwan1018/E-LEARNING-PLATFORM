import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Notification } from '../models/notification';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private api: ApiService) {}

  getNotificationsForUser(userId: number | string): Observable<Notification[]> {
    return this.api.get<Notification[]>('notifications', { userId, _sort: 'createdAt', _order: 'desc' });
  }

  getUnreadCount(userId: number | string): Observable<number> {
  // old: return this.api.get<Notification[]>('notifications', { userId, read: false });
  return this.api.get<number>('notifications/unread-count', { userId });
}


  createNotification(payload: Notification): Observable<Notification> {
    return this.api.post<Notification>('notifications', payload);
  }

  markAsRead(id: number | string): Observable<any> {
  // old flow was GET then PUT whole object; backend now exposes direct endpoint:
  return this.api.put<Notification>(`notifications/${id}/read`, {});
}


  
}
