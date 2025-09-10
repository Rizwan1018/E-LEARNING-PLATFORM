// src/app/models/course.ts
export interface Course {
  id: number;
  title: string;
  instructorId: number;
  domain: string;
  level: string;
  durationHrs?: number;
  tags?: string[];
  description?: string;

  // ✅ added new fields based on updated db.json
  price?: number;
  rating?: number;
  studentsCount?: number;
}
