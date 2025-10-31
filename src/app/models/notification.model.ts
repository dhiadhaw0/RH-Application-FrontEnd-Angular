import { User } from './user.model';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  recipient: User;
  isRead: boolean;
  createdAt: string | Date;
  user: User;
}