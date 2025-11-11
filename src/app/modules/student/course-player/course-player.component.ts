// src/app/modules/student/course-player/course-player.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AssessmentService } from '../../../services/assessment.service';

import { AnnouncementService } from '../../../services/announcement.service';
import { Announcement } from '../../../models/announcement'; 

@Component({
  selector: 'app-course-player',
  standalone:false,
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit {
  course?: Course;
  enrollment?: Enrollment | null;
  courseId!: number;
  enrollmentId?: number | null;
  studentId?: number | null;
  isWatched = false;
  isDone = false;
  currentRating: number | null = null;
  announcements: Announcement[] = [];

  // UI state
  currentTab: 'overview'|'notes'|'reviews'|'assessments'|'announcements' = 'overview';
  notesText = '';
  assessments: any[] = [];
  reviews: any[] = []; // simple local shape { user, rating, comment, date }

  @ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private assessmentSvc: AssessmentService,
     private announcementSvc: AnnouncementService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('courseId');
    this.courseId = idParam ? Number(idParam) : NaN;
    const q = this.route.snapshot.queryParamMap.get('enrollmentId');
    this.enrollmentId = q ? Number(q) : undefined;

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this.studentId = user?.id ?? null;

    if (this.courseId) {
      this.catalog.getCourse(this.courseId).subscribe(c => this.course = c);
       this.announcementSvc.getAnnouncementsForCourse(this.courseId)
    .subscribe(list => this.announcements = list || []);

    }

    this.loadNotes();
    this.resolveEnrollment().subscribe();

    // fetch assessments related to this course (if your service supports it)
    this.assessmentSvc.getAssessments().subscribe(list => {
      // if your assessments have courseId, filter, otherwise show all
      this.assessments = (list || []).filter((a: any) => !a.courseId || Number(a.courseId) === Number(this.courseId));
    }, err => {
      this.assessments = [];
    });

    // placeholder: fetch reviews - if you have a reviews endpoint replace this
    this.reviews = []; // can be loaded from NotificationService or a new ReviewService
  }

  setTab(t: 'overview'|'notes'|'reviews'|'assessments'|'announcements') {
    this.currentTab = t;
  }

  private resolveEnrollment() {
    if (this.enrollmentId) {
      return this.enrollSvc.getEnrollmentsByStudent(this.studentId ?? 0).pipe(
        switchMap((list: any[]) => {
          const found = (list || []).find(e => Number(e.id) === Number(this.enrollmentId));
          this.enrollment = found || null;
          this.refreshFlags();
          return (found ? of(found) : of(null));
        })
      );
    }

    if (!this.studentId) {
      return of(null);
    }

    return this.enrollSvc.findEnrollmentForStudent(this.studentId, this.courseId).pipe(
      switchMap(found => {
        if (found) {
          this.enrollment = found;
          this.enrollmentId = Number(found.id);
          this.refreshFlags();
          return of(found);
        }
        return this.enrollSvc.enroll(this.studentId!, this.courseId).pipe(
          switchMap((res: any) => {
            const created = (res && res.data) ? res.data : res;
            this.enrollment = created;
            this.enrollmentId = created?.id;
            this.refreshFlags();
            return of(created);
          })
        );
      })
    );
  }

  private refreshFlags() {
    this.isWatched = !!this.enrollment?.watched;
    this.isDone = !!this.enrollment?.done || (this.enrollment?.status === 'completed');
    this.currentRating = this.enrollment?.rating ?? null;
  }

  onVideoEnded() {
    if (!this.enrollmentId) return;
    const videoEl = this.videoRef?.nativeElement;
    const pos = videoEl ? Math.floor(videoEl.currentTime) : undefined;
    this.enrollSvc.markWatched(this.enrollmentId, pos).subscribe({
      next: (updated: any) => {
        this.enrollment = updated;
        this.refreshFlags();
        // auto-switch to notes or assessments to encourage interaction
        this.setTab('notes');
      },
      error: (err) => {
        console.error('markWatched failed', err);
      }
    });
  }

  onTimeUpdate() {
    // optional: you could save lastWatchedPosition periodically (every N seconds)
  }

  markDoneClicked() {
    if (!this.enrollmentId) { alert('Enrollment not found'); return; }
    this.enrollSvc.markDone(this.enrollmentId).subscribe({
      next: (updated: any) => {
        this.enrollment = updated;
        this.refreshFlags();
        alert('Course marked as done — you can now rate it.');
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Cannot mark done: ensure you watched the course first.');
      }
    });
  }

  onStarClick(star: number) {
    if (!this.enrollmentId) { alert('Enrollment not found'); return; }
    if (!this.isDone) { alert('Complete the course before rating.'); return; }
    this.enrollSvc.setRating(this.enrollmentId, star).subscribe({
      next: (updated: any) => {
        this.enrollment = updated;
        this.refreshFlags();
        alert('Thanks for rating!');
        if (this.course) {
          this.catalog.getCourse(this.courseId).subscribe(c => this.course = c);
        }
      },
      error: (err) => {
        console.error('rating failed', err);
        alert('Failed to save rating.');
      }
    });
  }

  // notes helpers (localStorage fallback)
  private getNotesKey() {
    return `course_${this.courseId}_notes_student_${this.studentId || 'guest'}`;
  }

  loadNotes() {
    try {
      const k = this.getNotesKey();
      const s = localStorage.getItem(k);
      this.notesText = s || '';
    } catch (e) {
      this.notesText = '';
    }
  }

  saveNotes() {
    try {
      const k = this.getNotesKey();
      localStorage.setItem(k, this.notesText || '');
      alert('Notes saved locally.');
      // TODO: call backend API to persist notes if available
    } catch (e) {
      console.error(e);
      alert('Failed to save notes.');
    }
  }

  clearNotes() {
    this.notesText = '';
    try {
      localStorage.removeItem(this.getNotesKey());
    } catch {}
  }

  togglePlay() {
    const v = this.videoRef?.nativeElement;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  continueLearning() {
    // jump to the video or first lesson - simple behavior: scroll to video
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  downloadResources() {
    // placeholder: if course.preRequisite is a url, open it
    if (this.course?.preRequisite) {
      console.log(this.course.preRequisite);
      window.open('http://localhost:8080/' + this.course.preRequisite, '_blank');
    } else {
      alert('No resources available for download.');
    }
  }
}