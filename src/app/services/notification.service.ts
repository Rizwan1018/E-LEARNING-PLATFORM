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

  getUnreadCount(userId: number | string): Observable<Notification[]> {
    return this.api.get<Notification[]>('notifications', { userId, read: false });
  }

  createNotification(payload: Notification): Observable<Notification> {
    return this.api.post<Notification>('notifications', payload);
  }

  markAsRead(id: number | string): Observable<Notification> {
    return this.api.get<Notification>(`notifications/${id}`).pipe(
      switchMap(n => this.api.put<Notification>(`notifications/${id}`, { ...n, read: true }))
    );
  }
}
