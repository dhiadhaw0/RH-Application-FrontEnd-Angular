export enum ContributionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum ContributionType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING'
}

export interface Contribution {
  id: number;
  campaignId: number;
  userId: number;
  amount: number;
  currency: string;
  status: ContributionStatus;
  type: ContributionType;
  tierId?: number;
  anonymous: boolean;
  message?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  transactionId?: number;
  rewards?: string[];
  refundedAt?: string | Date;
  refundReason?: string;
}

export interface ContributionReward {
  id: number;
  contributionId: number;
  rewardType: string;
  rewardValue: string;
  delivered: boolean;
  deliveredAt?: string | Date;
}