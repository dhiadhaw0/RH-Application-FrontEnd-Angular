import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SkillCredit, SkillCreditTransaction, SkillCreditSource } from '../models/skill-credit.model';

@Injectable({ providedIn: 'root' })
export class SkillCreditService {
  private readonly baseUrl = `${environment.apiBaseUrl}/skill-credits`;

  constructor(private http: HttpClient) {}

  // Credit Management
  getUserCredits(userId: number): Observable<SkillCredit[]> {
    return this.http.get<SkillCredit[]>(`${this.baseUrl}/user/${userId}`);
  }

  getCreditById(creditId: number): Observable<SkillCredit> {
    return this.http.get<SkillCredit>(`${this.baseUrl}/${creditId}`);
  }

  earnCredits(userId: number, source: SkillCreditSource, sourceId: number, amount: number, description: string): Observable<SkillCredit> {
    return this.http.post<SkillCredit>(`${this.baseUrl}/earn`, {
      userId,
      source,
      sourceId,
      amount,
      description
    });
  }

  useCredits(userId: number, amount: number, description: string, referenceId?: number): Observable<SkillCreditTransaction> {
    return this.http.post<SkillCreditTransaction>(`${this.baseUrl}/use`, {
      userId,
      amount,
      description,
      referenceId
    });
  }

  // Transaction History
  getCreditTransactions(userId: number, page: number = 0, size: number = 20): Observable<SkillCreditTransaction[]> {
    return this.http.get<SkillCreditTransaction[]>(`${this.baseUrl}/transactions/user/${userId}?page=${page}&size=${size}`);
  }

  getTransactionById(transactionId: number): Observable<SkillCreditTransaction> {
    return this.http.get<SkillCreditTransaction>(`${this.baseUrl}/transactions/${transactionId}`);
  }

  // Analytics
  getCreditBalance(userId: number): Observable<{ totalCredits: number; availableCredits: number; usedCredits: number }> {
    return this.http.get<{ totalCredits: number; availableCredits: number; usedCredits: number }>(`${this.baseUrl}/balance/${userId}`);
  }

  getCreditStats(userId: number, period: string = '30d'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats/${userId}?period=${period}`);
  }

  // Bulk Operations
  expireCredits(creditIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/expire`, { creditIds });
  }

  transferCredits(fromUserId: number, toUserId: number, amount: number, description: string): Observable<SkillCreditTransaction[]> {
    return this.http.post<SkillCreditTransaction[]>(`${this.baseUrl}/transfer`, {
      fromUserId,
      toUserId,
      amount,
      description
    });
  }
}