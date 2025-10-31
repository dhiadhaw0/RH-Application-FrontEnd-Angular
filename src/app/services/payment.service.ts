import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Payment, PaymentIntent } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}`);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }

  getPaymentsByInvoice(invoiceId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/invoice/${invoiceId}`);
  }

  getPaymentsByUser(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/user/${userId}`);
  }

  createPayment(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}`, payment);
  }

  processPayment(paymentData: any): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/process`, paymentData);
  }

  refundPayment(paymentId: number, amount?: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/${paymentId}/refund`, { amount });
  }

  // Stripe integration methods
  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.baseUrl}/create-intent`, { amount, currency });
  }

  confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/confirm-intent`, { paymentIntentId, paymentMethodId });
  }

  getPaymentMethods(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/methods/${userId}`);
  }

  attachPaymentMethod(userId: number, paymentMethodId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/attach-method`, { userId, paymentMethodId });
  }

  detachPaymentMethod(paymentMethodId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/detach-method`, { paymentMethodId });
  }
}