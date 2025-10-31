export enum TaxType {
  INCOME = 'INCOME',
  SALES = 'SALES',
  VAT = 'VAT',
  CORPORATE = 'CORPORATE',
  SELF_EMPLOYMENT = 'SELF_EMPLOYMENT'
}

export enum TaxStatus {
  PENDING = 'PENDING',
  FILED = 'FILED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export interface TaxRecord {
  id: number;
  userId: number;
  taxYear: number;
  taxType: TaxType;
  grossIncome: number;
  taxableIncome: number;
  taxOwed: number;
  taxPaid: number;
  taxDueDate: string | Date;
  status: TaxStatus;
  deductions: TaxDeduction[];
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TaxDeduction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string | Date;
}