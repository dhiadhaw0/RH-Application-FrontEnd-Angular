import { User } from './user.model';

export enum RecommendationType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface Recommendation {
  id: number;
  comment: string;
  type: RecommendationType;
  createdAt: string | Date;
  user: User;
}