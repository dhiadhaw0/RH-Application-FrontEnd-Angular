export enum StatutOffre {
  BROUILLON = 'BROUILLON',
  EN_VALIDATION = 'EN_VALIDATION',
  PUBLIQUE = 'PUBLIQUE',
  EXPIREE = 'EXPIREE',
  ARCHIVEE = 'ARCHIVEE'
}

export enum WorkflowStatus {
  REDACTION = 'REDACTION',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  PUBLIE = 'PUBLIE',
  ARCHIVE = 'ARCHIVE',
  REFUSE = 'REFUSE'
}

export interface JobOffer {
  idJobOffer: number;
  title: string;
  description: string;
  requirementsHardSkills: string[];
  requirementsSoftSkills: string[];
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  publishedAt: string | Date;
  expiresAt: string | Date;
  status: StatutOffre;
  workflowStatus: WorkflowStatus;
  user?: { id: number } | number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}


