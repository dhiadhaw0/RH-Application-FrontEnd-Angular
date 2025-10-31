import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Invoice, InvoiceItem } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly baseUrl = `${environment.apiBaseUrl}/invoices`;

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}`);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  getInvoicesByUser(userId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}/user/${userId}`);
  }

  createInvoice(invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}`, invoice);
  }

  updateInvoice(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  sendInvoice(id: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/${id}/send`, {});
  }

  markAsPaid(id: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/${id}/mark-paid`, {});
  }

  generateInvoiceNumber(): Observable<{ invoiceNumber: string }> {
    return this.http.get<{ invoiceNumber: string }>(`${this.baseUrl}/generate-number`);
  }

  calculateTotals(items: InvoiceItem[], taxRate: number): { subtotal: number; taxAmount: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }
}