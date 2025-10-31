import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EmploymentInsurance, InsuranceStatus } from '../models/insurance.model';
import { JobOfferService } from './job-offer.service';
import { Formation } from '../models/formation.model';

@Injectable({ providedIn: 'root' })
export class InsuranceService {
  private readonly baseUrl = `${environment.apiBaseUrl}/insurance`;

  constructor(
    private http: HttpClient,
    private jobOfferService: JobOfferService
  ) {}

  // Get all insurance policies for a user
  getUserInsurances(userId: number): Observable<EmploymentInsurance[]> {
    return this.http.get<EmploymentInsurance[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Get insurance by ID
  getInsuranceById(id: number): Observable<EmploymentInsurance> {
    return this.http.get<EmploymentInsurance>(`${this.baseUrl}/${id}`);
  }

  // Create insurance policy when formation is completed
  createInsurance(userId: number, formationId: number): Observable<EmploymentInsurance> {
    return this.calculateCoverageAmount(formationId).pipe(
      switchMap(coverageAmount => {
        const insuranceData = {
          userId,
          formationId,
          coverageAmount,
          coveragePeriodMonths: 6,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
          status: InsuranceStatus.ACTIVE
        };
        return this.http.post<EmploymentInsurance>(`${this.baseUrl}/create`, insuranceData);
      })
    );
  }

  // Calculate coverage amount based on job offer statistics
  calculateCoverageAmount(formationId: number): Observable<number> {
    // Get job offers related to the formation domain (assuming formation has domain)
    // For now, we'll use a simplified calculation based on average salaries
    return this.jobOfferService.getAllJobOffers().pipe(
      map(jobOffers => {
        const activeOffers = jobOffers.filter(offer =>
          offer.status === 'PUBLIQUE' &&
          offer.salaryMin && offer.salaryMax
        );

        if (activeOffers.length === 0) {
          return 5000; // Default coverage amount
        }

        const averageSalary = activeOffers.reduce((sum, offer) => {
          const avgSalary = (offer.salaryMin! + offer.salaryMax!) / 2;
          return sum + avgSalary;
        }, 0) / activeOffers.length;

        // Coverage is 70% of average monthly salary for 6 months
        const monthlyCoverage = averageSalary * 0.7;
        return monthlyCoverage * 6;
      })
    );
  }

  // Claim insurance (when user doesn't find employment)
  claimInsurance(insuranceId: number): Observable<EmploymentInsurance> {
    return this.http.post<EmploymentInsurance>(`${this.baseUrl}/${insuranceId}/claim`, {});
  }

  // Update insurance status
  updateInsuranceStatus(id: number, status: InsuranceStatus): Observable<EmploymentInsurance> {
    return this.http.put<EmploymentInsurance>(`${this.baseUrl}/${id}/status`, { status });
  }

  // Get insurance statistics
  getInsuranceStats(): Observable<{
    totalPolicies: number;
    activePolicies: number;
    claimedPolicies: number;
    totalCoverageAmount: number;
  }> {
    return this.http.get<{
      totalPolicies: number;
      activePolicies: number;
      claimedPolicies: number;
      totalCoverageAmount: number;
    }>(`${this.baseUrl}/stats`);
  }

  // Check if user is eligible for insurance on formation completion
  isEligibleForInsurance(userId: number, formationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/eligibility`, {
      params: { userId: userId.toString(), formationId: formationId.toString() }
    });
  }
}