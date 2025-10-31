import { User } from './user.model';

export interface MentorshipRequest {
  id: number;
  mentee: User;
  mentor: User;
  topic: string;
  description: string;
  requestedAt: string | Date;
  status: MentorshipRequestStatus;
  urgency: MentorshipUrgency;
}

export enum MentorshipRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum MentorshipUrgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}