export enum OfferType {
  MENTORSHIP_SESSION = 'MENTORSHIP_SESSION',
  FORMATION_ACCESS = 'FORMATION_ACCESS',
  SKILL_SHARING = 'SKILL_SHARING',
  CONSULTATION = 'CONSULTATION',
  CUSTOM_SERVICE = 'CUSTOM_SERVICE'
}

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface SkillCreditsOffer {
  id: number;
  sellerId: number;
  sellerName: string;
  title: string;
  description: string;
  offerType: OfferType;
  creditsRequired: number;
  maxParticipants?: number;
  currentParticipants: number;
  durationHours?: number;
  skills: string[];
  requirements: string[];
  status: OfferStatus;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  expiresAt?: string | Date;
  tags: string[];
}

export interface SkillCreditsTransaction {
  id: number;
  offerId: number;
  buyerId: number;
  sellerId: number;
  creditsAmount: number;
  status: TransactionStatus;
  transactionDate: string | Date;
  completionDate?: string | Date;
  buyerRating?: number;
  sellerRating?: number;
  buyerReview?: string;
  sellerReview?: string;
  disputeReason?: string;
  refundAmount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MarketplaceStats {
  totalOffers: number;
  activeOffers: number;
  totalTransactions: number;
  totalCreditsExchanged: number;
  averageRating: number;
  topCategories: { category: string; count: number }[];
  recentActivity: SkillCreditsTransaction[];
}

export interface OfferFilters {
  offerType?: OfferType;
  minCredits?: number;
  maxCredits?: number;
  skills?: string[];
  rating?: number;
  availability?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'popularity';
}

export interface CreateOfferRequest {
  title: string;
  description: string;
  offerType: OfferType;
  creditsRequired: number;
  maxParticipants?: number;
  durationHours?: number;
  skills: string[];
  requirements: string[];
  expiresAt?: string | Date;
  tags: string[];
}

export interface PurchaseOfferRequest {
  offerId: number;
  buyerId: number;
  specialRequests?: string;
}