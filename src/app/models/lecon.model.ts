import { Formation } from './formation.model';

export interface Lecon {
  id: number;
  titre: string;
  formation: Formation;
  videoUrl?: string;
  documentUrl?: string;
  workFileUrl?: string;
}