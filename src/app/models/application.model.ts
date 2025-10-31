export enum StatutCandidature {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS_DE_TRAITEMENT = 'EN_COURS_DE_TRAITEMENT',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  ENTRETIEN_PLANIFIE = 'ENTRETIEN_PLANIFIE',
  ENTRETIEN_EFFECTUE = 'ENTRETIEN_EFFECTUE',
  OFFRE_PROPOSEE = 'OFFRE_PROPOSEE',
  OFFRE_ACCEPTEE = 'OFFRE_ACCEPTEE',
  OFFRE_REFUSEE = 'OFFRE_REFUSEE'
}

export enum TypeEntretien {
  RH = 'RH',
  TECHNIQUE = 'TECHNIQUE',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT'
}

export enum StatutEntretien {
  PROGRAMME = 'PROGRAMME',
  REALISE = 'REALISE',
  ANNULE = 'ANNULE'
}

export enum TypeTest {
  QCM = 'QCM',
  CODE = 'CODE',
  OUVERT = 'OUVERT'
}

export enum TypeDocument {
  CV = 'CV',
  LETTRE_MOTIVATION = 'LETTRE_MOTIVATION',
  PORTFOLIO = 'PORTFOLIO',
  DIPLOME = 'DIPLOME',
  CERTIFICATION = 'CERTIFICATION',
  CONTRAT = 'CONTRAT',
  AUTRE = 'AUTRE'
}

export interface Application {
  idApplication: number;
  motivationLetter?: string;
  motivationLetterFileUrl?: string;
  coverLetter?: string;
  status: StatutCandidature;
  aiRelevanceReport?: string;
  relevanceScore?: number;
  scoreIA?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  jobOffer: { idJobOffer: number } | number;
  user: { id: number } | number;
}


