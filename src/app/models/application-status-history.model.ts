import { Application, StatutCandidature } from './application.model';

export interface ApplicationStatusHistory {
  id: number;
  application: Application;
  oldStatus: StatutCandidature;
  newStatus: StatutCandidature;
  changedAt: string | Date;
  note?: string;
}