import { Lecon } from './lecon.model';

export interface LeconVue {
  id: number;
  userId: number;
  lecon: Lecon;
  dateVue: string | Date;
}