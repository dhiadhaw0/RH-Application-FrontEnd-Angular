import { Application, TypeTest } from './application.model';

export interface TestEvaluation {
  id: number;
  testType: TypeTest;
  score?: number;
  submittedAt: string | Date;
  fileUrl?: string;
  application: Application;
}