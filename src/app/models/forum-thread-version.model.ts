import { ForumThread } from './forum-thread.model';
import { User } from './user.model';

export interface ForumThreadVersion {
  id: number;
  thread: ForumThread;
  title: string;
  content: string;
  editedAt: string | Date;
  editor: User;
  versionNumber: number;
}