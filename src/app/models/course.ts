export interface Course {
  id: number;
  title: string;
  instructorId: number;
  domain: string;
  level: string;
  durationHrs?: number;
  tags?: string[];   // <- array
  description?: string;
}
