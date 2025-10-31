import { User } from './user.model';

export interface Disponibilite {
  id: number;
  startDateTime: string | Date;
  endDateTime: string | Date;
  user: User;
}