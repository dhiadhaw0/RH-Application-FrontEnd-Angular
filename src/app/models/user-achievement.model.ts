import { User } from './user.model';
import { Achievement } from './achievement.model';

export interface UserAchievement {
  id: number;
  user: User;
  achievement: Achievement;
  unlockedAt: string | Date;
  progress?: number; // For achievements that require multiple steps
  isCompleted: boolean;
}

export interface UserPoints {
  userId: number;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  nextLevelThreshold: number;
}