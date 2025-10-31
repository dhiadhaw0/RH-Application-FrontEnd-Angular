import { JobOffer } from './job-offer.model';

export interface JobOfferVersion {
  id: number;
  jobOffer: JobOffer;
  versionNumber: number;
  draft: boolean;
  savedAt: string | Date;
  offerSnapshotJson: string;
}