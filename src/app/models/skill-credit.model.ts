export enum SkillCreditStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export enum SkillCreditSource {
  CERTIFICATION = 'CERTIFICATION',
  TRAINING = 'TRAINING',
  ASSESSMENT = 'ASSESSMENT',
  MENTORSHIP = 'MENTORSHIP'
}

export interface SkillCredit {
  id: number;
  userId: number;
  amount: number; // Micro-credits amount
  source: SkillCreditSource;
  sourceId: number; // ID of the certification, training, etc.
  earnedDate: string | Date;
  expiryDate?: string | Date;
  status: SkillCreditStatus;
  description: string;
  usedAmount?: number; // Amount already used
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SkillCreditTransaction {
  id: number;
  userId: number;
  creditId: number;
  amount: number;
  type: 'EARNED' | 'USED' | 'EXPIRED';
  description: string;
  transactionDate: string | Date;
  referenceId?: number; // Job application, purchase, etc.
}