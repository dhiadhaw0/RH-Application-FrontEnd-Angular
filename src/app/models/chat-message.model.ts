import { User } from './user.model';

export interface ChatMessage {
  id: number;
  sender: User;
  recipient: User;
  content: string;
  timestamp: string | Date;
  read: boolean;
  moderated: boolean;
}