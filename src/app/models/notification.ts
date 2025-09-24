export interface Notification {
  id?: number|string;
  userId: number | string;
  courseId?: number | string;
  type: 'enrollment' | 'completion' | 'announcement' | 'submission' | 'query';
  message: string;
  createdAt: string;
  read: boolean;
}

