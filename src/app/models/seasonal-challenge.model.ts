import { Achievement } from './achievement.model';

export interface SeasonalChallenge {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  startDate: string | Date;
  endDate: string | Date;
  achievements: Achievement[];
  isActive: boolean;
  theme: ChallengeTheme;
  bonusMultiplier: number; // Points multiplier during challenge period
  createdAt: string | Date;
}

export enum ChallengeTheme {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  HOLIDAY = 'HOLIDAY',
  BACK_TO_SCHOOL = 'BACK_TO_SCHOOL',
  CAREER_BOOST = 'CAREER_BOOST',
  SKILL_MASTER = 'SKILL_MASTER'
}

export interface ChallengeProgress {
  challengeId: number;
  userId: number;
  achievementsCompleted: number;
  totalAchievements: number;
  bonusPointsEarned: number;
  completedAt?: string | Date;
}