import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  SkillInvestmentFund,
  SkillInvestment,
  SkillInvestmentTransaction,
  InvestmentFundType,
  InvestmentStatus
} from '../models/skill-investment.model';

@Injectable({
  providedIn: 'root'
})
export class SkillInvestmentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/skill-investments`;

  constructor(private http: HttpClient) {}

  // Fund Management
  getAllFunds(): Observable<SkillInvestmentFund[]> {
    return this.http.get<SkillInvestmentFund[]>(`${this.baseUrl}/funds`);
  }

  getFundById(fundId: number): Observable<SkillInvestmentFund> {
    return this.http.get<SkillInvestmentFund>(`${this.baseUrl}/funds/${fundId}`);
  }

  getFundsByType(type: InvestmentFundType): Observable<SkillInvestmentFund[]> {
    return this.http.get<SkillInvestmentFund[]>(`${this.baseUrl}/funds/type/${type}`);
  }

  createFund(fund: Partial<SkillInvestmentFund>): Observable<SkillInvestmentFund> {
    return this.http.post<SkillInvestmentFund>(`${this.baseUrl}/funds`, fund);
  }

  updateFund(fundId: number, fund: Partial<SkillInvestmentFund>): Observable<SkillInvestmentFund> {
    return this.http.put<SkillInvestmentFund>(`${this.baseUrl}/funds/${fundId}`, fund);
  }

  closeFund(fundId: number): Observable<SkillInvestmentFund> {
    return this.http.post<SkillInvestmentFund>(`${this.baseUrl}/funds/${fundId}/close`, {});
  }

  // Investment Management
  getUserInvestments(userId: number): Observable<SkillInvestment[]> {
    return this.http.get<SkillInvestment[]>(`${this.baseUrl}/user/${userId}`);
  }

  getInvestmentById(investmentId: number): Observable<SkillInvestment> {
    return this.http.get<SkillInvestment>(`${this.baseUrl}/investments/${investmentId}`);
  }

  investInFund(userId: number, fundId: number, creditsAmount: number): Observable<SkillInvestment> {
    return this.http.post<SkillInvestment>(`${this.baseUrl}/invest`, {
      userId,
      fundId,
      creditsAmount
    });
  }

  withdrawInvestment(investmentId: number, creditsAmount: number): Observable<SkillInvestmentTransaction> {
    return this.http.post<SkillInvestmentTransaction>(`${this.baseUrl}/withdraw`, {
      investmentId,
      creditsAmount
    });
  }

  // Transaction History
  getInvestmentTransactions(userId: number, page: number = 0, size: number = 20): Observable<SkillInvestmentTransaction[]> {
    return this.http.get<SkillInvestmentTransaction[]>(`${this.baseUrl}/transactions/user/${userId}?page=${page}&size=${size}`);
  }

  getFundTransactions(fundId: number): Observable<SkillInvestmentTransaction[]> {
    return this.http.get<SkillInvestmentTransaction[]>(`${this.baseUrl}/transactions/fund/${fundId}`);
  }

  // Analytics
  getInvestmentStats(userId: number): Observable<{
    totalInvested: number;
    currentValue: number;
    totalReturns: number;
    performanceRate: number;
  }> {
    return this.http.get<{
      totalInvested: number;
      currentValue: number;
      totalReturns: number;
      performanceRate: number;
    }>(`${this.baseUrl}/stats/${userId}`);
  }

  getFundStats(fundId: number): Observable<{
    totalInvestors: number;
    totalCredits: number;
    currentValue: number;
    performanceRate: number;
  }> {
    return this.http.get<{
      totalInvestors: number;
      totalCredits: number;
      currentValue: number;
      performanceRate: number;
    }>(`${this.baseUrl}/funds/${fundId}/stats`);
  }

  // Performance Tracking
  getFundPerformance(fundId: number, period: string = '30d'): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/funds/${fundId}/performance?period=${period}`);
  }

  getUserInvestmentPerformance(userId: number, period: string = '30d'): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/performance/${userId}?period=${period}`);
  }

  // Dividend Distribution
  distributeDividends(fundId: number): Observable<SkillInvestmentTransaction[]> {
    return this.http.post<SkillInvestmentTransaction[]>(`${this.baseUrl}/funds/${fundId}/distribute-dividends`, {});
  }
}