export enum CareerGoalCategory {
  EDUCATION = 'EDUCATION',
  EQUIPMENT = 'EQUIPMENT',
  CERTIFICATIONS = 'CERTIFICATIONS',
  TRAINING = 'TRAINING',
  BUSINESS = 'BUSINESS',
  OTHER = 'OTHER'
}

export enum CareerGoalStatus {
  ACTIVE = 'ACTIVE',
  FUNDED = 'FUNDED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface CareerGoal {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: CareerGoalCategory;
  targetAmount: number;
  currentAmount: number;
  currency: string; // Using string for simplicity, can be enum later
  status: CareerGoalStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  endDate: string | Date;
  milestones?: Milestone[];
}

export interface Milestone {
  id: number;
  careerGoalId: number;
  title: string;
  description: string;
  targetAmount: number;
  achieved: boolean;
  achievedAt?: string | Date;
}