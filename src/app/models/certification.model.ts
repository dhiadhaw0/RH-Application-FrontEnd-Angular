import { Formation } from './formation.model';
import { StatutCertification } from './formation.model';

export interface Certification {
  id: number;
  dateObtained: string | Date;
  status: StatutCertification;
  formation: Formation;
}