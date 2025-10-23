export interface Course {
  id: number;
  title: string;
  instructorId: number;
  domain: string;
  level: string;
  durationHrs?: number;
  tags?: string;
  description?: string;
  price?: number;
  rating?: number;
  studentsCount?: number;
  thumbnail?: string;
  videoUrl?: string;

  displayTags?: string[];
}