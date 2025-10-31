import { JobOffer, WorkflowStatus } from './job-offer.model';

export interface JobOfferStatusHistory {
  id: number;
  jobOffer: JobOffer;
  oldStatus?: WorkflowStatus;
  newStatus?: WorkflowStatus;
  changedAt: string | Date;
}