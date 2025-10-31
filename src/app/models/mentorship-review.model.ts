import { MentorshipSession } from './mentorship-session.model';
import { User } from './user.model';

export interface MentorshipReview {
  id: number;
  session: MentorshipSession;
  reviewer: User;
  rating: number;
  comment?: string;
  createdAt: string | Date;
}