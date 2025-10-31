import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaymentMethod, PaymentMethodType, PaymentProvider } from '../models/digital-wallet.model';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private readonly baseUrl = `${environment.apiBaseUrl}/payment-methods`;

  constructor(private http: HttpClient) {}

  // Payment Method Management
  getUserPaymentMethods(userId: number): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}/user/${userId}`);
  }

  getPaymentMethodById(id: number): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.baseUrl}/${id}`);
  }

  addPaymentMethod(userId: number, paymentMethod: Partial<PaymentMethod>): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}`, paymentMethod);
  }

  updatePaymentMethod(id: number, paymentMethod: Partial<PaymentMethod>): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(`${this.baseUrl}/${id}`, paymentMethod);
  }

  deletePaymentMethod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setDefaultPaymentMethod(userId: number, paymentMethodId: number): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}/set-default/${paymentMethodId}`, {});
  }

  // Card Operations
  addCreditCard(userId: number, cardData: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
    holderName: string;
    nickname?: string;
  }): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}/card`, cardData);
  }

  updateCreditCard(id: number, cardData: {
    expiryMonth: number;
    expiryYear: number;
    nickname?: string;
  }): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(`${this.baseUrl}/${id}/card`, cardData);
  }

  // Bank Account Operations
  addBankAccount(userId: number, bankData: {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    holderName: string;
    nickname?: string;
  }): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}/bank`, bankData);
  }

  // Digital Wallet Operations
  addPayPalAccount(userId: number, paypalData: {
    email: string;
    nickname?: string;
  }): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}/paypal`, paypalData);
  }

  addApplePay(userId: number, applePayData: {
    deviceId: string;
    nickname?: string;
  }): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}/apple-pay`, applePayData);
  }

  addGooglePay(userId: number, googlePayData: {
    deviceId: string;
    nickname?: string;
  }): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/user/${userId}/google-pay`, googlePayData);
  }

  // Verification
  verifyPaymentMethod(id: number, verificationData: any): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/${id}/verify`, verificationData);
  }

  sendVerificationCode(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/${id}/send-verification`, {});
  }

  // Security
  tokenizePaymentMethod(id: number): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/${id}/tokenize`, {});
  }

  // Analytics
  getPaymentMethodUsage(userId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}/usage?start=${startDate}&end=${endDate}`);
  }

  // Utility Methods
  getPaymentMethodIcon(type: PaymentMethodType, provider: PaymentProvider): string {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        switch (provider) {
          case PaymentProvider.VISA: return 'fab fa-cc-visa';
          case PaymentProvider.MASTERCARD: return 'fab fa-cc-mastercard';
          case PaymentProvider.AMEX: return 'fab fa-cc-amex';
          case PaymentProvider.DISCOVER: return 'fab fa-cc-discover';
          default: return 'fas fa-credit-card';
        }
      case PaymentMethodType.BANK_ACCOUNT:
        return 'fas fa-university';
      case PaymentMethodType.PAYPAL:
        return 'fab fa-paypal';
      case PaymentMethodType.APPLE_PAY:
        return 'fab fa-apple-pay';
      case PaymentMethodType.GOOGLE_PAY:
        return 'fab fa-google-pay';
      default:
        return 'fas fa-credit-card';
    }
  }

  maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 4) return cardNumber;
    return '•••• •••• •••• ' + cardNumber.slice(-4);
  }

  formatExpiryDate(month: number, year: number): string {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  }
}