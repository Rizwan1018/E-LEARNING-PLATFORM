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

  // optional fields used for student UI
  price?: number;
  rating?: number;
  studentsCount?: number;

  // media fields (optional)
  thumbnail?: string;
  videoUrl?: string;
}