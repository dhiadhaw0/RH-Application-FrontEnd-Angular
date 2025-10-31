import { User } from './user.model';

export interface MentorAvailability {
  id: number;
  mentor: User;
  startDateTime: string | Date;
  endDateTime: string | Date;
  isBooked: boolean;
}