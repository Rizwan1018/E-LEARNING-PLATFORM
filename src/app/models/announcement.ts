export interface Announcement {
  id?: number|string;
  courseId: number | string;
  instructorId: number;
  title: string;
  message: string;
  createdAt: string;
}
