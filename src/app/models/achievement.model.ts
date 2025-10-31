export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  points: number;
  category: AchievementCategory;
  triggerType: AchievementTriggerType;
  triggerValue?: number;
  isActive: boolean;
  createdAt: string | Date;
}

export enum AchievementCategory {
  FORMATION = 'FORMATION',
  APPLICATION = 'APPLICATION',
  MENTORSHIP = 'MENTORSHIP',
  SKILL = 'SKILL',
  COMMUNITY = 'COMMUNITY',
  GENERAL = 'GENERAL'
}

export enum AchievementTriggerType {
  FORMATION_COMPLETED = 'FORMATION_COMPLETED',
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  MENTORSHIP_SESSION_COMPLETED = 'MENTORSHIP_SESSION_COMPLETED',
  SKILL_ASSESSED = 'SKILL_ASSESSED',
  FORUM_POST_CREATED = 'FORUM_POST_CREATED',
  LOGIN_STREAK = 'LOGIN_STREAK',
  POINTS_EARNED = 'POINTS_EARNED'
}