import { Formation } from './formation.model';

export interface TraductionFormation {
  id: number;
  langue: string;
  titreTraduit: string;
  descriptionTraduite?: string;
  contenuTraduit?: string;
  formation: Formation;
}