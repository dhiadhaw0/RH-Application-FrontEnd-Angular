import { Application, TypeEntretien, StatutEntretien } from './application.model';

export interface Interview {
  id: number;
  type: TypeEntretien;
  scheduledAt: string | Date;
  status: StatutEntretien;
  report?: string;
  documentUrl?: string;
  application: Application;
}