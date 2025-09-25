// src/app/models/enrollment.ts
export interface Enrollment {
  id?: number|string;
  studentId: number|string;
  courseId: number|string;
  enrollmentDate: string;
  progress: number;
  status: string;
}
