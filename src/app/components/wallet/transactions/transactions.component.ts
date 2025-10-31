import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DigitalWalletService } from '../../../services/digital-wallet.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  Currency
} from '../../../models/digital-wallet.model';

@Component({
  selector: 'app-transactions',
  standalone: false,
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isLoading = false;
  currentUser: any;

  // Filter form
  filterForm: FormGroup;

  // Filter options
  transactionTypes = Object.values(TransactionType);
  transactionStatuses = Object.values(TransactionStatus);
  currencies = Object.values(Currency);

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Search
  searchTerm = '';

  // Filter properties for template
  selectedType = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';

  // Summary calculations
  get totalIncome(): number {
    return this.filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpenses(): number {
    return Math.abs(this.filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
  }

  get netBalance(): number {
    return this.filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }

  // Transaction details modal
  selectedTransaction: Transaction | null = null;

  constructor(
    private fb: FormBuilder,
    private walletService: DigitalWalletService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.filterForm = this.fb.group({
      type: [''],
      status: [''],
      currency: [''],
      dateFrom: [''],
      dateTo: [''],
      amountMin: [''],
      amountMax: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTransactions();
    this.setupFilterSubscription();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.transactions = this.getStaticTransactions();
    this.applyFilters();

    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment for API integration
    /*
    this.walletService.getUserTransactions(this.currentUser?.id).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.applyFilters();
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.transactions];

    const filters = this.filterForm.value;

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filter by currency
    if (filters.currency) {
      filtered = filtered.filter(t => t.currency === filters.currency);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(t => new Date(t.createdAt) <= toDate);
    }

    // Filter by amount range
    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.amountMin));
    }

    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.amountMax));
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.referenceId?.toLowerCase().includes(term) ||
        t.type.toLowerCase().includes(term)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.filteredTransactions = filtered;
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.searchTerm = '';
    this.applyFilters();
  }

  get paginatedTransactions(): Transaction[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStatusBadgeClass(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.COMPLETED: return 'badge-success';
      case TransactionStatus.PENDING: return 'badge-warning';
      case TransactionStatus.FAILED: return 'badge-danger';
      case TransactionStatus.CANCELLED: return 'badge-secondary';
      case TransactionStatus.REFUNDED: return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getTypeBadgeClass(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'badge-success';
      case TransactionType.WITHDRAWAL: return 'badge-danger';
      case TransactionType.PAYMENT: return 'badge-primary';
      case TransactionType.REFUND: return 'badge-info';
      case TransactionType.TRANSFER: return 'badge-secondary';
      case TransactionType.SUBSCRIPTION: return 'badge-warning';
      case TransactionType.FEE: return 'badge-danger';
      case TransactionType.EXCHANGE: return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getTypeIcon(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'fas fa-arrow-down';
      case TransactionType.WITHDRAWAL: return 'fas fa-arrow-up';
      case TransactionType.PAYMENT: return 'fas fa-credit-card';
      case TransactionType.REFUND: return 'fas fa-undo';
      case TransactionType.TRANSFER: return 'fas fa-exchange-alt';
      case TransactionType.SUBSCRIPTION: return 'fas fa-calendar-alt';
      case TransactionType.FEE: return 'fas fa-dollar-sign';
      case TransactionType.EXCHANGE: return 'fas fa-sync-alt';
      default: return 'fas fa-question';
    }
  }

  formatAmount(amount: number, currency: Currency): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  exportTransactions(): void {
    const csvData = this.convertToCSV(this.filteredTransactions);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(transactions: Transaction[]): string {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Currency', 'Status', 'Reference ID'];
    const rows = transactions.map(t => [
      this.formatDate(t.createdAt),
      t.type,
      t.description,
      t.amount.toString(),
      t.currency,
      t.status,
      t.referenceId || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Static data for demonstration
  private getStaticTransactions(): Transaction[] {
    return [
      {
        id: 1,
        walletId: 1,
        type: TransactionType.DEPOSIT,
        amount: 500.00,
        currency: Currency.USD,
        description: 'Bank transfer deposit',
        status: TransactionStatus.COMPLETED,
        referenceId: 'TXN_001',
        createdAt: new Date('2024-10-25T10:30:00'),
        updatedAt: new Date('2024-10-25T10:30:00')
      },
      {
        id: 2,
        walletId: 1,
        type: TransactionType.PAYMENT,
        amount: -49.99,
        currency: Currency.USD,
        description: 'Premium Mentorship Subscription',
        status: TransactionStatus.COMPLETED,
        referenceId: 'SUB_001',
        paymentMethodId: 1,
        createdAt: new Date('2024-10-24T15:45:00'),
        updatedAt: new Date('2024-10-24T15:45:00')
      },
      {
        id: 3,
        walletId: 1,
        type: TransactionType.TRANSFER,
        amount: -100.00,
        currency: Currency.USD,
        description: 'Transfer to savings wallet',
        status: TransactionStatus.COMPLETED,
        referenceId: 'TRF_001',
        createdAt: new Date('2024-10-23T09:15:00'),
        updatedAt: new Date('2024-10-23T09:15:00')
      },
      {
        id: 4,
        walletId: 1,
        type: TransactionType.REFUND,
        amount: 29.99,
        currency: Currency.USD,
        description: 'Refund for cancelled formation',
        status: TransactionStatus.COMPLETED,
        referenceId: 'REF_001',
        createdAt: new Date('2024-10-22T14:20:00'),
        updatedAt: new Date('2024-10-22T14:20:00')
      },
      {
        id: 5,
        walletId: 1,
        type: TransactionType.FEE,
        amount: -2.99,
        currency: Currency.USD,
        description: 'Transaction fee',
        status: TransactionStatus.COMPLETED,
        referenceId: 'FEE_001',
        createdAt: new Date('2024-10-21T11:00:00'),
        updatedAt: new Date('2024-10-21T11:00:00')
      },
      {
        id: 6,
        walletId: 1,
        type: TransactionType.SUBSCRIPTION,
        amount: -29.99,
        currency: Currency.USD,
        description: 'Formation Access Monthly',
        status: TransactionStatus.PENDING,
        referenceId: 'SUB_002',
        paymentMethodId: 2,
        createdAt: new Date('2024-10-20T08:30:00'),
        updatedAt: new Date('2024-10-20T08:30:00')
      },
      {
        id: 7,
        walletId: 1,
        type: TransactionType.EXCHANGE,
        amount: 85.50,
        currency: Currency.EUR,
        description: 'Currency exchange USD to EUR',
        status: TransactionStatus.COMPLETED,
        referenceId: 'EXC_001',
        exchangeRate: 0.85,
        originalAmount: 100.00,
        originalCurrency: Currency.USD,
        createdAt: new Date('2024-10-19T16:45:00'),
        updatedAt: new Date('2024-10-19T16:45:00')
      },
      {
        id: 8,
        walletId: 1,
        type: TransactionType.WITHDRAWAL,
        amount: -200.00,
        currency: Currency.USD,
        description: 'ATM withdrawal',
        status: TransactionStatus.FAILED,
        referenceId: 'WDL_001',
        createdAt: new Date('2024-10-18T12:00:00'),
        updatedAt: new Date('2024-10-18T12:00:00')
      }
    ];
  }

  changeItemsPerPage(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  // Modal methods
  viewTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

  closeTransactionDetails(): void {
    this.selectedTransaction = null;
  }

  // Action methods
  canRetry(transaction: Transaction): boolean {
    return transaction.status === TransactionStatus.FAILED;
  }

  canRefund(transaction: Transaction): boolean {
    return transaction.status === TransactionStatus.COMPLETED &&
           transaction.type === TransactionType.PAYMENT &&
           transaction.amount < 0;
  }

  retryTransaction(transaction: Transaction): void {
    // Implementation for retrying failed transactions
    alert('Retry functionality would be implemented here');
  }

  refundTransaction(transaction: Transaction): void {
    // Implementation for processing refunds
    alert('Refund functionality would be implemented here');
  }

  // Sorting methods
  sortBy(field: string): void {
    // Implementation for sorting transactions
    console.log('Sorting by:', field);
  }

  getSortIcon(field: string): string {
    // Return sort icon based on current sort field and direction
    return 'fa-sort';
  }

  // Additional utility methods
  getTypeClass(type: string): string {
    return type.toLowerCase().replace('_', '-');
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'fa-check-circle';
      case 'PENDING': return 'fa-clock';
      case 'FAILED': return 'fa-times-circle';
      case 'CANCELLED': return 'fa-ban';
      default: return 'fa-question-circle';
    }
  }

  formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatTime(date: string | Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
