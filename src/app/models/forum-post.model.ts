import { ForumThread } from './forum-thread.model';
import { User } from './user.model';

export interface ForumPost {
  id: number;
  thread: ForumThread;
  author: User;
  content: string;
  createdAt: string | Date;
  isAnswer: boolean;
  anonymous: boolean;
  attachments?: any[]; // Optional attachments array
  upvotes?: number; // Optional upvotes count
  repliesCount?: number; // Optional replies count
}