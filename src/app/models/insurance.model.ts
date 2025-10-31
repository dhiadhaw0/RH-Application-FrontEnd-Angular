export enum InsuranceStatus {
  ACTIVE = 'ACTIVE',
  CLAIMED = 'CLAIMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface EmploymentInsurance {
  id: number;
  userId: number;
  formationId: number;
  coverageAmount: number;
  coveragePeriodMonths: number; // 6 months
  startDate: string | Date;
  endDate: string | Date;
  status: InsuranceStatus;
  claimDate?: string | Date;
  claimAmount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  // Relations
  user?: { id: number; firstName: string; lastName: string; email: string };
  formation?: { idFormation: number; title: string; prix: number };
}