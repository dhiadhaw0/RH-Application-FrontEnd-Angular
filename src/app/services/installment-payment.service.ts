import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  InstallmentPlan,
  InstallmentPayment,
  InstallmentEligibility,
  InstallmentStatus,
  InstallmentFrequency
} from '../models/installment-payment.model';

@Injectable({
  providedIn: 'root'
})
export class InstallmentPaymentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/installment-payments`;

  constructor(private http: HttpClient) {}

  // Installment Plan Management
  getUserInstallmentPlans(userId: number): Observable<InstallmentPlan[]> {
    return this.http.get<InstallmentPlan[]>(`${this.baseUrl}/user/${userId}`);
  }

  getInstallmentPlanById(planId: number): Observable<InstallmentPlan> {
    return this.http.get<InstallmentPlan>(`${this.baseUrl}/plans/${planId}`);
  }

  createInstallmentPlan(plan: Partial<InstallmentPlan>): Observable<InstallmentPlan> {
    return this.http.post<InstallmentPlan>(`${this.baseUrl}/plans`, plan);
  }

  updateInstallmentPlan(planId: number, plan: Partial<InstallmentPlan>): Observable<InstallmentPlan> {
    return this.http.put<InstallmentPlan>(`${this.baseUrl}/plans/${planId}`, plan);
  }

  cancelInstallmentPlan(planId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/plans/${planId}/cancel`, {});
  }

  // Payment Management
  getInstallmentPayments(planId: number): Observable<InstallmentPayment[]> {
    return this.http.get<InstallmentPayment[]>(`${this.baseUrl}/plans/${planId}/payments`);
  }

  makeInstallmentPayment(planId: number, paymentData: {
    installmentNumber: number;
    amount: number;
    skillCreditsUsed?: number;
  }): Observable<InstallmentPayment> {
    return this.http.post<InstallmentPayment>(`${this.baseUrl}/plans/${planId}/pay`, paymentData);
  }

  // Eligibility Check
  checkInstallmentEligibility(userId: number, formationId: number, totalAmount: number): Observable<InstallmentEligibility> {
    return this.http.get<InstallmentEligibility>(
      `${this.baseUrl}/eligibility?userId=${userId}&formationId=${formationId}&totalAmount=${totalAmount}`
    );
  }

  // Calculations
  calculateInstallmentPlan(params: {
    totalAmount: number;
    downPayment: number;
    numberOfInstallments: number;
    frequency: InstallmentFrequency;
    interestRate: number;
  }): Observable<{
    installmentAmount: number;
    totalInterest: number;
    totalPayable: number;
    schedule: Array<{
      installmentNumber: number;
      amount: number;
      dueDate: string;
    }>;
  }> {
    return this.http.post<{
      installmentAmount: number;
      totalInterest: number;
      totalPayable: number;
      schedule: Array<{
        installmentNumber: number;
        amount: number;
        dueDate: string;
      }>;
    }>(`${this.baseUrl}/calculate`, params);
  }

  // Analytics
  getInstallmentStats(userId: number): Observable<{
    totalPlans: number;
    activePlans: number;
    completedPlans: number;
    totalAmountPaid: number;
    totalAmountRemaining: number;
    nextPaymentDue?: string;
  }> {
    return this.http.get<{
      totalPlans: number;
      activePlans: number;
      completedPlans: number;
      totalAmountPaid: number;
      totalAmountRemaining: number;
      nextPaymentDue?: string;
    }>(`${this.baseUrl}/stats/${userId}`);
  }

  // Notifications
  getUpcomingPayments(userId: number, daysAhead: number = 7): Observable<InstallmentPayment[]> {
    return this.http.get<InstallmentPayment[]>(`${this.baseUrl}/upcoming-payments/${userId}?days=${daysAhead}`);
  }

  getOverduePayments(userId: number): Observable<InstallmentPayment[]> {
    return this.http.get<InstallmentPayment[]>(`${this.baseUrl}/overdue-payments/${userId}`);
  }

  // Formation Integration
  getFormationInstallmentOptions(formationId: number): Observable<{
    available: boolean;
    minDownPayment: number;
    maxInstallments: number;
    interestRate: number;
    supportedFrequencies: InstallmentFrequency[];
  }> {
    return this.http.get<{
      available: boolean;
      minDownPayment: number;
      maxInstallments: number;
      interestRate: number;
      supportedFrequencies: InstallmentFrequency[];
    }>(`${this.baseUrl}/formations/${formationId}/options`);
  }
}