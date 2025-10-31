import { ForumPost } from './forum-post.model';

export interface ForumAttachment {
  id: number;
  post: ForumPost;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string | Date;
}