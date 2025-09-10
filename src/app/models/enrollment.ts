// src/app/models/enrollment.ts
export interface Enrollment {
  id?: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  progress: number;
  status: string;
}
