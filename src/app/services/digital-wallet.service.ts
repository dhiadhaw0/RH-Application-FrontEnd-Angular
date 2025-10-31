import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  DigitalWallet,
  Transaction,
  TransactionType,
  TransactionStatus,
  Currency
} from '../models/digital-wallet.model';

@Injectable({ providedIn: 'root' })
export class DigitalWalletService {
  private readonly baseUrl = `${environment.apiBaseUrl}/wallets`;

  constructor(private http: HttpClient) {}

  // Wallet Management
  getUserWallets(userId: number): Observable<DigitalWallet[]> {
    return this.http.get<DigitalWallet[]>(`${this.baseUrl}/user/${userId}`);
  }

  getWalletById(id: number): Observable<DigitalWallet> {
    return this.http.get<DigitalWallet>(`${this.baseUrl}/${id}`);
  }

  createWallet(wallet: Partial<DigitalWallet>): Observable<DigitalWallet> {
    return this.http.post<DigitalWallet>(`${this.baseUrl}`, wallet);
  }

  updateWallet(id: number, wallet: Partial<DigitalWallet>): Observable<DigitalWallet> {
    return this.http.put<DigitalWallet>(`${this.baseUrl}/${id}`, wallet);
  }

  deleteWallet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setDefaultWallet(userId: number, walletId: number): Observable<DigitalWallet> {
    return this.http.post<DigitalWallet>(`${this.baseUrl}/user/${userId}/set-default/${walletId}`, {});
  }

  // Balance Operations
  getWalletBalance(walletId: number): Observable<{ balance: number; currency: Currency }> {
    return this.http.get<{ balance: number; currency: Currency }>(`${this.baseUrl}/${walletId}/balance`);
  }

  addFunds(walletId: number, amount: number, currency: Currency = Currency.USD): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/${walletId}/add-funds`, { amount, currency });
  }

  withdrawFunds(walletId: number, amount: number, currency: Currency = Currency.USD): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/${walletId}/withdraw-funds`, { amount, currency });
  }

  // Transaction Management
  getWalletTransactions(walletId: number, page: number = 0, size: number = 20): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/${walletId}/transactions?page=${page}&size=${size}`);
  }

  getTransactionById(transactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/transactions/${transactionId}`);
  }

  createTransaction(walletId: number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/${walletId}/transactions`, transaction);
  }

  // Currency Exchange
  exchangeCurrency(walletId: number, fromCurrency: Currency, toCurrency: Currency, amount: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/${walletId}/exchange`, {
      fromCurrency,
      toCurrency,
      amount
    });
  }

  getExchangeRate(fromCurrency: Currency, toCurrency: Currency): Observable<{ rate: number; timestamp: string }> {
    return this.http.get<{ rate: number; timestamp: string }>(
      `${this.baseUrl}/exchange-rate?from=${fromCurrency}&to=${toCurrency}`
    );
  }

  // Transfer Operations
  transferFunds(fromWalletId: number, toWalletId: number, amount: number, description?: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transfer`, {
      fromWalletId,
      toWalletId,
      amount,
      description
    });
  }

  // Quick Actions
  payInvoice(walletId: number, invoiceId: number, amount?: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/${walletId}/pay-invoice/${invoiceId}`, { amount });
  }

  setupAutoTopup(walletId: number, threshold: number, amount: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${walletId}/auto-topup`, { threshold, amount });
  }

  // Analytics
  getWalletStats(walletId: number, period: string = '30d'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${walletId}/stats?period=${period}`);
  }

  getTransactionSummary(walletId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${walletId}/transaction-summary?start=${startDate}&end=${endDate}`);
  }
}