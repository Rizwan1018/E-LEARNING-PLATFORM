import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Announcement } from '../models/announcement';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  constructor(private api: ApiService) {}

  getAnnouncementsForCourse(courseId: number | string): Observable<Announcement[]> {
    return this.api.get<Announcement[]>('announcements', { courseId, _sort: 'createdAt', _order: 'desc' });
  }

  createAnnouncement(payload: Announcement): Observable<Announcement> {
    return this.api.post<Announcement>('announcements', payload);
  }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.api.get<Announcement[]>('announcements', { _sort: 'createdAt', _order: 'desc' });
  }
}
