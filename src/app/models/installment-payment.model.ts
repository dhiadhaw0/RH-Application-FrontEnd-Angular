export enum InstallmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum InstallmentFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  WEEKLY = 'WEEKLY'
}

export interface InstallmentPlan {
  id: number;
  userId: number;
  formationId: number;
  totalAmount: number;
  downPayment: number;
  installmentAmount: number;
  numberOfInstallments: number;
  frequency: InstallmentFrequency;
  interestRate: number;
  totalInterest: number;
  totalPayable: number;
  skillCreditsGuarantee: number;
  status: InstallmentStatus;
  startDate: string | Date;
  endDate: string | Date;
  nextPaymentDate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface InstallmentPayment {
  id: number;
  installmentPlanId: number;
  installmentNumber: number;
  amount: number;
  dueDate: string | Date;
  paidDate?: string | Date;
  status: InstallmentStatus;
  penaltyAmount?: number;
  skillCreditsUsed?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface InstallmentEligibility {
  isEligible: boolean;
  maxInstallments: number;
  minDownPayment: number;
  availableCreditLimit: number;
  requiredSkillCredits: number;
  reasons?: string[];
}