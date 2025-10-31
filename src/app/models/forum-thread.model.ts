import { ForumCategory } from './forum-category.model';
import { User } from './user.model';

export interface ForumThread {
  id: number;
  category: ForumCategory;
  author: User;
  title: string;
  content: string;
  createdAt: string | Date;
  isPinned: boolean;
  isClosed: boolean;
  lastPost?: {
    id: number;
    content: string;
    author: User;
    createdAt: string | Date;
    anonymous: boolean;
  };
}