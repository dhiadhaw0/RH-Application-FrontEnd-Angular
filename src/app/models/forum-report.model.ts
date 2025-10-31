import { User } from './user.model';
import { ForumThread } from './forum-thread.model';
import { ForumPost } from './forum-post.model';

export enum Status {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACTIONED = 'ACTIONED',
  DISMISSED = 'DISMISSED'
}

export enum ActionTaken {
  NONE = 'NONE',
  WARNED = 'WARNED',
  DELETED = 'DELETED',
  BANNED = 'BANNED',
  DISMISSED = 'DISMISSED'
}

export interface ForumReport {
  id: number;
  reporter: User;
  reportedThread?: ForumThread;
  reportedPost?: ForumPost;
  reason: string;
  status: Status;
  createdAt: string | Date;
  moderator?: User;
  moderatorComment?: string;
  actionTaken: ActionTaken;
}