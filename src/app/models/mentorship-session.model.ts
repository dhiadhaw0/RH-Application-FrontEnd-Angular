import { MentorshipRequest } from './mentorship-request.model';

export enum Status {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface MentorshipSession {
  id: number;
  mentorshipRequest: MentorshipRequest;
  scheduledAt: string | Date;
  durationMinutes: number;
  location: string;
  agenda?: string;
  mentorNotes?: string;
  menteeNotes?: string;
  status: Status;
}