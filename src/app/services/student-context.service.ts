// src/app/services/student-context.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentContextService {
  // holds the currently-selected student id (null = not selected yet)
  private _studentId = new BehaviorSubject<number | null>(null);
  studentId$ = this._studentId.asObservable();

  setStudentId(id: number | null) {
    this._studentId.next(id);
  }

  getStudentId(): number | null {
    return this._studentId.value;
  }
}