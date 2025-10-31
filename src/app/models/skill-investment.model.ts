export enum InvestmentFundType {
  FORMATION_PERFORMANCE = 'FORMATION_PERFORMANCE',
  CAREER_PROGRESSION = 'CAREER_PROGRESSION',
  MENTORSHIP_SUCCESS = 'MENTORSHIP_SUCCESS',
  GENERAL_SKILLS = 'GENERAL_SKILLS'
}

export enum InvestmentStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  LIQUIDATED = 'LIQUIDATED'
}

export interface SkillInvestmentFund {
  id: number;
  name: string;
  description: string;
  type: InvestmentFundType;
  totalCreditsInvested: number;
  currentValue: number;
  performanceRate: number; // Percentage return
  minInvestment: number;
  maxInvestment?: number;
  lockPeriodMonths: number;
  status: InvestmentStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  endDate?: string | Date;
}

export interface SkillInvestment {
  id: number;
  userId: number;
  fundId: number;
  investedCredits: number;
  currentValue: number;
  investmentDate: string | Date;
  maturityDate?: string | Date;
  status: InvestmentStatus;
  returnsGenerated: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SkillInvestmentTransaction {
  id: number;
  investmentId: number;
  userId: number;
  type: 'INVEST' | 'WITHDRAW' | 'DIVIDEND';
  amount: number;
  creditsAmount: number;
  transactionDate: string | Date;
  description: string;
}