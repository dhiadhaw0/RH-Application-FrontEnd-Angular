import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TaxRecord, TaxDeduction } from '../models/tax-record.model';

@Injectable({ providedIn: 'root' })
export class TaxService {
  private readonly baseUrl = `${environment.apiBaseUrl}/taxes`;

  constructor(private http: HttpClient) {}

  getAllTaxRecords(): Observable<TaxRecord[]> {
    return this.http.get<TaxRecord[]>(`${this.baseUrl}`);
  }

  getTaxRecordById(id: number): Observable<TaxRecord> {
    return this.http.get<TaxRecord>(`${this.baseUrl}/${id}`);
  }

  getTaxRecordsByUser(userId: number): Observable<TaxRecord[]> {
    return this.http.get<TaxRecord[]>(`${this.baseUrl}/user/${userId}`);
  }

  getTaxRecordsByYear(userId: number, year: number): Observable<TaxRecord[]> {
    return this.http.get<TaxRecord[]>(`${this.baseUrl}/user/${userId}/year/${year}`);
  }

  createTaxRecord(taxRecord: Partial<TaxRecord>): Observable<TaxRecord> {
    return this.http.post<TaxRecord>(`${this.baseUrl}`, taxRecord);
  }

  updateTaxRecord(id: number, taxRecord: Partial<TaxRecord>): Observable<TaxRecord> {
    return this.http.put<TaxRecord>(`${this.baseUrl}/${id}`, taxRecord);
  }

  deleteTaxRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addDeduction(taxRecordId: number, deduction: Partial<TaxDeduction>): Observable<TaxDeduction> {
    return this.http.post<TaxDeduction>(`${this.baseUrl}/${taxRecordId}/deductions`, deduction);
  }

  removeDeduction(taxRecordId: number, deductionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taxRecordId}/deductions/${deductionId}`);
  }

  calculateTax(income: number, taxType: string, deductions: number = 0): Observable<{ taxOwed: number; effectiveRate: number }> {
    return this.http.post<{ taxOwed: number; effectiveRate: number }>(`${this.baseUrl}/calculate`, { income, taxType, deductions });
  }

  fileTaxReturn(taxRecordId: number): Observable<TaxRecord> {
    return this.http.post<TaxRecord>(`${this.baseUrl}/${taxRecordId}/file`, {});
  }

  markTaxAsPaid(taxRecordId: number): Observable<TaxRecord> {
    return this.http.post<TaxRecord>(`${this.baseUrl}/${taxRecordId}/mark-paid`, {});
  }

  // Tax calculation helpers
  calculateProgressiveTax(income: number, brackets: { min: number; max: number; rate: number }[]): number {
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;

      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInBracket * (bracket.rate / 100);
      remainingIncome -= taxableInBracket;
    }

    return tax;
  }

  calculateSelfEmploymentTax(income: number): number {
    // Simplified calculation - in reality, this would be more complex
    const selfEmploymentTaxRate = 15.3; // Social Security + Medicare
    return income * (selfEmploymentTaxRate / 100);
  }
}