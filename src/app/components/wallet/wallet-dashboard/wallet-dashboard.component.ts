import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalWalletService } from '../../../services/digital-wallet.service';
import { PaymentMethodService } from '../../../services/payment-method.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import {
  DigitalWallet,
  Transaction,
  PaymentMethod,
  Subscription,
  Currency,
  TransactionType,
  TransactionStatus
} from '../../../models/digital-wallet.model';

@Component({
  selector: 'app-wallet-dashboard',
  standalone: false,
  templateUrl: './wallet-dashboard.component.html',
  styleUrl: './wallet-dashboard.component.scss'
})
export class WalletDashboardComponent implements OnInit {
  wallets: DigitalWallet[] = [];
  currentWallet: DigitalWallet | null = null;
  recentTransactions: Transaction[] = [];
  paymentMethods: PaymentMethod[] = [];
  activeSubscriptions: Subscription[] = [];
  investmentStats: any = {};
  isLoading = false;
  currentUser: any;

  // Quick action amounts
  quickAmounts = [25, 50, 100, 250, 500];

  constructor(
    private walletService: DigitalWalletService,
    private paymentMethodService: PaymentMethodService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.wallets = this.getStaticWallets();
    this.currentWallet = this.wallets[0]; // Set first wallet as current
    this.recentTransactions = this.getStaticTransactions();
    this.paymentMethods = this.getStaticPaymentMethods();
    this.activeSubscriptions = this.getStaticSubscriptions();

    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment below for API integration
    /*
    this.walletService.getUserWallets(this.currentUser?.id).subscribe({
      next: (wallets) => {
        this.wallets = wallets;
        this.currentWallet = wallets.find(w => w.isDefault) || wallets[0];
        if (this.currentWallet) {
          this.loadWalletData(this.currentWallet.id);
        }
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading wallets:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  loadWalletData(walletId: number): void {
    // Load transactions, payment methods, subscriptions for the selected wallet
    this.walletService.getWalletTransactions(walletId, 0, 10).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
      },
      error: (error) => console.error('Error loading transactions:', error)
    });
  }

  selectWallet(wallet: DigitalWallet): void {
    this.currentWallet = wallet;
    this.loadWalletData(wallet.id);
  }

  addFunds(amount: number): void {
    if (!this.currentWallet) return;

    this.loadingService.showLoader();
    this.walletService.addFunds(this.currentWallet.id, amount).subscribe({
      next: (transaction) => {
        this.recentTransactions.unshift(transaction);
        this.currentWallet!.balance += amount;
        this.loadingService.hideLoader();
        alert('Funds added successfully!');
      },
      error: (error) => {
        console.error('Error adding funds:', error);
        this.loadingService.hideLoader();
        alert('Failed to add funds. Please try again.');
      }
    });
  }

  withdrawFunds(amount: number): void {
    if (!this.currentWallet || this.currentWallet.balance < amount) {
      alert('Insufficient balance!');
      return;
    }

    this.loadingService.showLoader();
    this.walletService.withdrawFunds(this.currentWallet.id, amount).subscribe({
      next: (transaction) => {
        this.recentTransactions.unshift(transaction);
        this.currentWallet!.balance -= amount;
        this.loadingService.hideLoader();
        alert('Withdrawal successful!');
      },
      error: (error) => {
        console.error('Error withdrawing funds:', error);
        this.loadingService.hideLoader();
        alert('Failed to withdraw funds. Please try again.');
      }
    });
  }

  transferFunds(toWalletId: number, amount: number): void {
    if (!this.currentWallet || this.currentWallet.balance < amount) {
      alert('Insufficient balance!');
      return;
    }

    this.loadingService.showLoader();
    this.walletService.transferFunds(this.currentWallet.id, toWalletId, amount).subscribe({
      next: (transaction) => {
        this.recentTransactions.unshift(transaction);
        this.currentWallet!.balance -= amount;
        this.loadingService.hideLoader();
        alert('Transfer successful!');
      },
      error: (error) => {
        console.error('Error transferring funds:', error);
        this.loadingService.hideLoader();
        alert('Failed to transfer funds. Please try again.');
      }
    });
  }

  navigateToTransactions(): void {
    this.router.navigate(['/wallet/transactions']);
  }

  navigateToPaymentMethods(): void {
    this.router.navigate(['/wallet/payment-methods']);
  }

  navigateToSubscriptions(): void {
    this.router.navigate(['/wallet/subscriptions']);
  }

  navigateToInvestments(): void {
    this.router.navigate(['/investments/dashboard']);
  }

  quickInvest(): void {
    // Navigate to quick investment page or open modal
    this.router.navigate(['/investments/create']);
  }

  viewInvestmentFunds(): void {
    this.router.navigate(['/investments/funds']);
  }

  getPerformanceColor(rate: number): string {
    if (rate > 0) return 'text-success';
    if (rate < 0) return 'text-danger';
    return 'text-muted';
  }

  getTransactionIcon(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'fas fa-arrow-down text-success';
      case TransactionType.WITHDRAWAL: return 'fas fa-arrow-up text-danger';
      case TransactionType.PAYMENT: return 'fas fa-credit-card text-primary';
      case TransactionType.REFUND: return 'fas fa-undo text-info';
      case TransactionType.TRANSFER: return 'fas fa-exchange-alt text-warning';
      default: return 'fas fa-circle text-secondary';
    }
  }

  getTransactionColor(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'text-success';
      case TransactionType.WITHDRAWAL: return 'text-danger';
      case TransactionType.PAYMENT: return 'text-primary';
      case TransactionType.REFUND: return 'text-info';
      case TransactionType.TRANSFER: return 'text-warning';
      default: return 'text-secondary';
    }
  }

  formatCurrency(amount: number, currency: Currency = Currency.USD): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  // Static data methods for demonstration
  private getStaticWallets(): DigitalWallet[] {
    return [
      {
        id: 1,
        userId: 1,
        walletNumber: 'WL-001-123456',
        balance: 2450.75,
        currency: Currency.USD,
        status: 'ACTIVE' as any,
        isDefault: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-10-26'),
        transactions: [],
        paymentMethods: [],
        subscriptions: []
      },
      {
        id: 2,
        userId: 1,
        walletNumber: 'WL-002-789012',
        balance: 850.50,
        currency: Currency.EUR,
        status: 'ACTIVE' as any,
        isDefault: false,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-10-26'),
        transactions: [],
        paymentMethods: [],
        subscriptions: []
      }
    ];
  }

  private getStaticTransactions(): Transaction[] {
    return [
      {
        id: 1,
        walletId: 1,
        type: TransactionType.DEPOSIT,
        amount: 500,
        currency: Currency.USD,
        description: 'Bank transfer deposit',
        status: TransactionStatus.COMPLETED,
        createdAt: new Date('2024-10-25'),
        updatedAt: new Date('2024-10-25')
      },
      {
        id: 2,
        walletId: 1,
        type: TransactionType.PAYMENT,
        amount: -150,
        currency: Currency.USD,
        description: 'Mentorship session payment',
        referenceId: 'session-123',
        status: TransactionStatus.COMPLETED,
        createdAt: new Date('2024-10-24'),
        updatedAt: new Date('2024-10-24')
      },
      {
        id: 3,
        walletId: 1,
        type: TransactionType.SUBSCRIPTION,
        amount: -29.99,
        currency: Currency.USD,
        description: 'Premium subscription renewal',
        referenceId: 'sub-456',
        status: TransactionStatus.COMPLETED,
        createdAt: new Date('2024-10-20'),
        updatedAt: new Date('2024-10-20')
      },
      {
        id: 4,
        walletId: 1,
        type: TransactionType.REFUND,
        amount: 75,
        currency: Currency.USD,
        description: 'Formation cancellation refund',
        referenceId: 'formation-789',
        status: TransactionStatus.COMPLETED,
        createdAt: new Date('2024-10-18'),
        updatedAt: new Date('2024-10-18')
      }
    ];
  }

  private getStaticPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 1,
        userId: 1,
        walletId: 1,
        type: 'CREDIT_CARD' as any,
        provider: 'VISA' as any,
        lastFour: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
        isVerified: true,
        nickname: 'Primary Visa',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        userId: 1,
        walletId: 1,
        type: 'PAYPAL' as any,
        provider: 'PAYPAL' as any,
        lastFour: '',
        isDefault: false,
        isVerified: true,
        nickname: 'PayPal Account',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      }
    ];
  }

  private getStaticSubscriptions(): Subscription[] {
    return [
      {
        id: 1,
        userId: 1,
        walletId: 1,
        paymentMethodId: 1,
        name: 'Premium Career Coaching',
        description: 'Monthly premium career coaching sessions',
        amount: 99.99,
        currency: Currency.USD,
        frequency: 'MONTHLY' as any,
        nextBillingDate: new Date('2024-11-26'),
        status: 'ACTIVE' as any,
        autoRenew: true,
        cancelAtPeriodEnd: false,
        createdAt: new Date('2024-08-26'),
        updatedAt: new Date('2024-10-26'),
        billingHistory: []
      },
      {
        id: 2,
        userId: 1,
        walletId: 1,
        paymentMethodId: 2,
        name: 'Skill Assessment Pro',
        description: 'Advanced skill assessment tools',
        amount: 29.99,
        currency: Currency.USD,
        frequency: 'MONTHLY' as any,
        nextBillingDate: new Date('2024-11-15'),
        status: 'ACTIVE' as any,
        autoRenew: true,
        cancelAtPeriodEnd: false,
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-10-15'),
        billingHistory: []
      }
    ];
  }
}
