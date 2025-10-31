export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  FUNDED = 'FUNDED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  REFUNDING = 'REFUNDING',
  REFUNDED = 'REFUNDED'
}

export enum CampaignCategory {
  EDUCATION = 'EDUCATION',
  EQUIPMENT = 'EQUIPMENT',
  CERTIFICATIONS = 'CERTIFICATIONS',
  TRAINING = 'TRAINING',
  BUSINESS = 'BUSINESS',
  OTHER = 'OTHER'
}

export interface FundingCampaign {
  id: number;
  careerGoalId: number;
  userId: number;
  title: string;
  description: string;
  category: CampaignCategory;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  status: CampaignStatus;
  startDate: string | Date;
  endDate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  contributionTiers: ContributionTier[];
  milestones: CampaignMilestone[];
  images?: string[];
  videoUrl?: string;
  tags?: string[];
}

export interface ContributionTier {
  id: number;
  campaignId: number;
  name: string;
  description: string;
  amount: number;
  currency: string;
  rewards: string[];
  maxContributors?: number;
  currentContributors: number;
}

export interface CampaignMilestone {
  id: number;
  campaignId: number;
  title: string;
  description: string;
  targetAmount: number;
  achieved: boolean;
  achievedAt?: string | Date;
  order: number;
}