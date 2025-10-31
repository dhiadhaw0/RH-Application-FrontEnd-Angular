import { ForumPost } from './forum-post.model';
import { User } from './user.model';

export interface ForumPostVersion {
  id: number;
  post: ForumPost;
  content: string;
  editedAt: string | Date;
  editor: User;
  versionNumber: number;
}