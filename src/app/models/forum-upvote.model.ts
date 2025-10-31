import { ForumPost } from './forum-post.model';
import { User } from './user.model';

export interface ForumUpvote {
  id: number;
  post: ForumPost;
  user: User;
}