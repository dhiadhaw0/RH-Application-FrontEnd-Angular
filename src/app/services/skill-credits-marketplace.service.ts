import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  SkillCreditsOffer,
  SkillCreditsTransaction,
  MarketplaceStats,
  OfferFilters,
  CreateOfferRequest,
  PurchaseOfferRequest,
  OfferType,
  OfferStatus,
  TransactionStatus
} from '../models/skill-credits-marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class SkillCreditsMarketplaceService {
  private readonly baseUrl = `${environment.apiBaseUrl}/marketplace`;

  constructor(private http: HttpClient) {}

  // Offer Management
  getAllOffers(filters?: OfferFilters, page: number = 0, size: number = 20): Observable<SkillCreditsOffer[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.offerType) params = params.set('offerType', filters.offerType);
      if (filters.minCredits) params = params.set('minCredits', filters.minCredits.toString());
      if (filters.maxCredits) params = params.set('maxCredits', filters.maxCredits.toString());
      if (filters.rating) params = params.set('rating', filters.rating.toString());
      if (filters.availability !== undefined) params = params.set('availability', filters.availability.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => {
          params = params.append('skills', skill);
        });
      }
    }

    return this.http.get<SkillCreditsOffer[]>(`${this.baseUrl}/offers`, { params });
  }

  getOfferById(offerId: number): Observable<SkillCreditsOffer> {
    return this.http.get<SkillCreditsOffer>(`${this.baseUrl}/offers/${offerId}`);
  }

  getUserOffers(userId: number, status?: OfferStatus): Observable<SkillCreditsOffer[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<SkillCreditsOffer[]>(`${this.baseUrl}/users/${userId}/offers`, { params });
  }

  createOffer(offer: CreateOfferRequest): Observable<SkillCreditsOffer> {
    return this.http.post<SkillCreditsOffer>(`${this.baseUrl}/offers`, offer);
  }

  updateOffer(offerId: number, offer: Partial<SkillCreditsOffer>): Observable<SkillCreditsOffer> {
    return this.http.put<SkillCreditsOffer>(`${this.baseUrl}/offers/${offerId}`, offer);
  }

  deleteOffer(offerId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/offers/${offerId}`);
  }

  pauseOffer(offerId: number): Observable<SkillCreditsOffer> {
    return this.http.post<SkillCreditsOffer>(`${this.baseUrl}/offers/${offerId}/pause`, {});
  }

  resumeOffer(offerId: number): Observable<SkillCreditsOffer> {
    return this.http.post<SkillCreditsOffer>(`${this.baseUrl}/offers/${offerId}/resume`, {});
  }

  // Transaction Management
  purchaseOffer(purchase: PurchaseOfferRequest): Observable<SkillCreditsTransaction> {
    return this.http.post<SkillCreditsTransaction>(`${this.baseUrl}/purchase`, purchase);
  }

  getUserTransactions(userId: number, page: number = 0, size: number = 20): Observable<SkillCreditsTransaction[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<SkillCreditsTransaction[]>(`${this.baseUrl}/users/${userId}/transactions`, { params });
  }

  getTransactionById(transactionId: number): Observable<SkillCreditsTransaction> {
    return this.http.get<SkillCreditsTransaction>(`${this.baseUrl}/transactions/${transactionId}`);
  }

  completeTransaction(transactionId: number, rating?: number, review?: string): Observable<SkillCreditsTransaction> {
    return this.http.post<SkillCreditsTransaction>(`${this.baseUrl}/transactions/${transactionId}/complete`, {
      rating,
      review
    });
  }

  cancelTransaction(transactionId: number, reason: string): Observable<SkillCreditsTransaction> {
    return this.http.post<SkillCreditsTransaction>(`${this.baseUrl}/transactions/${transactionId}/cancel`, {
      reason
    });
  }

  disputeTransaction(transactionId: number, reason: string): Observable<SkillCreditsTransaction> {
    return this.http.post<SkillCreditsTransaction>(`${this.baseUrl}/transactions/${transactionId}/dispute`, {
      reason
    });
  }

  // Analytics and Stats
  getMarketplaceStats(): Observable<MarketplaceStats> {
    return this.http.get<MarketplaceStats>(`${this.baseUrl}/stats`);
  }

  getUserMarketplaceStats(userId: number): Observable<{
    totalOffers: number;
    activeOffers: number;
    completedTransactions: number;
    totalEarnings: number;
    averageRating: number;
  }> {
    return this.http.get<{
      totalOffers: number;
      activeOffers: number;
      completedTransactions: number;
      totalEarnings: number;
      averageRating: number;
    }>(`${this.baseUrl}/users/${userId}/stats`);
  }

  // Search and Discovery
  searchOffers(query: string, filters?: OfferFilters, page: number = 0, size: number = 20): Observable<SkillCreditsOffer[]> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.offerType) params = params.set('offerType', filters.offerType);
      if (filters.minCredits) params = params.set('minCredits', filters.minCredits.toString());
      if (filters.maxCredits) params = params.set('maxCredits', filters.maxCredits.toString());
      if (filters.rating) params = params.set('rating', filters.rating.toString());
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => {
          params = params.append('skills', skill);
        });
      }
    }

    return this.http.get<SkillCreditsOffer[]>(`${this.baseUrl}/search`, { params });
  }

  getRecommendedOffers(userId: number, limit: number = 10): Observable<SkillCreditsOffer[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<SkillCreditsOffer[]>(`${this.baseUrl}/users/${userId}/recommendations`, { params });
  }

  // Categories and Tags
  getPopularSkills(): Observable<{ skill: string; count: number }[]> {
    return this.http.get<{ skill: string; count: number }[]>(`${this.baseUrl}/skills/popular`);
  }

  getOfferCategories(): Observable<{ category: OfferType; count: number; label: string }[]> {
    return this.http.get<{ category: OfferType; count: number; label: string }[]>(`${this.baseUrl}/categories`);
  }

  // Favorites
  addToFavorites(userId: number, offerId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/favorites/${offerId}`, {});
  }

  removeFromFavorites(userId: number, offerId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}/favorites/${offerId}`);
  }

  getUserFavorites(userId: number): Observable<SkillCreditsOffer[]> {
    return this.http.get<SkillCreditsOffer[]>(`${this.baseUrl}/users/${userId}/favorites`);
  }

  // Reviews and Ratings
  getOfferReviews(offerId: number, page: number = 0, size: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any[]>(`${this.baseUrl}/offers/${offerId}/reviews`, { params });
  }

  submitReview(transactionId: number, rating: number, review: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/transactions/${transactionId}/review`, {
      rating,
      review
    });
  }
}