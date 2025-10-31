export interface CompanyProfile {
  id: number;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  industry: string;
  size: string; // e.g., "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
  foundedYear?: number;
  headquarters: string;
  cultureVideos?: string[]; // URLs to culture videos
  photos?: string[]; // URLs to company photos
  benefits: CompanyBenefit[];
  testimonials: EmployeeTestimonial[];
  followersCount: number;
  isFollowing?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface EmployeeTestimonial {
  id: number;
  employeeName: string;
  employeePosition: string;
  employeeAvatar?: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  isVerified: boolean;
  createdAt: string | Date;
}

export interface CompanyBenefit {
  id: number;
  name: string;
  description: string;
  category: BenefitCategory;
  value?: number; // monetary value if applicable
  isActive: boolean;
}

export enum BenefitCategory {
  HEALTH = 'HEALTH',
  FINANCIAL = 'FINANCIAL',
  PROFESSIONAL_DEVELOPMENT = 'PROFESSIONAL_DEVELOPMENT',
  WORK_LIFE_BALANCE = 'WORK_LIFE_BALANCE',
  PERKS = 'PERKS',
  INSURANCE = 'INSURANCE'
}