import { Certification } from './certification.model';
import { TraductionFormation } from './traduction-formation.model';
import { Lecon } from './lecon.model';
import { ProgressionFormation } from './progression-formation.model';

export enum TypeFormation {
  WEBINAIR = 'WEBINAIR',
  PDF = 'PDF',
  VIDEO = 'VIDEO'
}

export enum StatutFormation {
  EN_COURS = 'EN_COURS',
  COMPLETE = 'COMPLETE'
}

export enum StatutCertification {
  EN_COURS = 'EN_COURS',
  OBTENUE = 'OBTENUE',
  ECHOUEE = 'ECHOUEE'
}

export interface Formation {
  idFormation: number;
  title: string;
  description?: string;
  niveau?: string;
  domaine?: string;
  duree?: string;
  lieu?: string;
  prix?: number;
  prerequis?: string;
  programme?: string;
  provider: string;
  certification?: string;
  typeFormation?: TypeFormation;
  statutFormation?: StatutFormation;
  active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: { id: number } | number;
  notesUsers?: number[];
  noteMoyenne?: number;
  certifications?: Certification[];
  traductions?: TraductionFormation[];
  lessons?: Lecon[];
  progressionFormations?: ProgressionFormation[];
}


