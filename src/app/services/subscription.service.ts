import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionFrequency,
  SubscriptionBilling,
  Currency
} from '../models/digital-wallet.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  // Subscription Management
  getUserSubscriptions(userId: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/user/${userId}`);
  }

  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.baseUrl}/${id}`);
  }

  createSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}`, subscription);
  }

  updateSubscription(id: number, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.baseUrl}/${id}`, subscription);
  }

  cancelSubscription(id: number, cancelAtPeriodEnd: boolean = true): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/${id}/cancel`, { cancelAtPeriodEnd });
  }

  reactivateSubscription(id: number): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/${id}/reactivate`, {});
  }

  // Billing Management
  getSubscriptionBillingHistory(subscriptionId: number): Observable<SubscriptionBilling[]> {
    return this.http.get<SubscriptionBilling[]>(`${this.baseUrl}/${subscriptionId}/billing`);
  }

  processSubscriptionBilling(subscriptionId: number): Observable<SubscriptionBilling> {
    return this.http.post<SubscriptionBilling>(`${this.baseUrl}/${subscriptionId}/bill`, {});
  }

  // Payment Method Updates
  updateSubscriptionPaymentMethod(subscriptionId: number, paymentMethodId: number): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.baseUrl}/${subscriptionId}/payment-method`, { paymentMethodId });
  }

  // Trial Management
  startTrial(subscriptionId: number, trialDays: number): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/${subscriptionId}/start-trial`, { trialDays });
  }

  endTrial(subscriptionId: number): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/${subscriptionId}/end-trial`, {});
  }

  // Analytics and Reporting
  getSubscriptionAnalytics(userId: number, period: string = '30d'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}/analytics?period=${period}`);
  }

  getUpcomingBillings(userId: number, days: number = 30): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/user/${userId}/upcoming?days=${days}`);
  }

  // Bulk Operations
  bulkCancelSubscriptions(subscriptionIds: number[], cancelAtPeriodEnd: boolean = true): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/bulk-cancel`, { subscriptionIds, cancelAtPeriodEnd });
  }

  bulkUpdatePaymentMethod(subscriptionIds: number[], paymentMethodId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/bulk-update-payment-method`, { subscriptionIds, paymentMethodId });
  }

  // Utility Methods
  calculateNextBillingDate(frequency: SubscriptionFrequency, currentDate: Date = new Date()): Date {
    const date = new Date(currentDate);
    switch (frequency) {
      case SubscriptionFrequency.DAILY:
        date.setDate(date.getDate() + 1);
        break;
      case SubscriptionFrequency.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case SubscriptionFrequency.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case SubscriptionFrequency.QUARTERLY:
        date.setMonth(date.getMonth() + 3);
        break;
      case SubscriptionFrequency.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
  }

  getFrequencyLabel(frequency: SubscriptionFrequency): string {
    switch (frequency) {
      case SubscriptionFrequency.DAILY: return 'Daily';
      case SubscriptionFrequency.WEEKLY: return 'Weekly';
      case SubscriptionFrequency.MONTHLY: return 'Monthly';
      case SubscriptionFrequency.QUARTERLY: return 'Quarterly';
      case SubscriptionFrequency.YEARLY: return 'Yearly';
      default: return frequency;
    }
  }

  getStatusLabel(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.ACTIVE: return 'Active';
      case SubscriptionStatus.TRIALING: return 'Trial';
      case SubscriptionStatus.PAST_DUE: return 'Past Due';
      case SubscriptionStatus.CANCELLED: return 'Cancelled';
      case SubscriptionStatus.UNPAID: return 'Unpaid';
      default: return status;
    }
  }

  formatSubscriptionAmount(amount: number, currency: Currency): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Predefined Subscription Plans
  getAvailablePlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plans`);
  }

  subscribeToPlan(userId: number, planId: string, paymentMethodId: number): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/subscribe`, {
      userId,
      planId,
      paymentMethodId
    });
  }

  // Webhook handling (for backend integration)
  handleWebhook(webhookData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/webhook`, webhookData);
  }
}