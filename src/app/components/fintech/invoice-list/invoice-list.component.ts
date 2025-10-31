import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { Invoice, InvoiceStatus } from '../../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: false,
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  isLoading = false;
  currentUser: any;
  statusFilter: string = 'ALL';
  searchTerm: string = '';

  invoiceStatuses = [
    { value: 'ALL', label: 'All Invoices' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SENT', label: 'Sent' },
    { value: 'PAID', label: 'Paid' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.invoices = this.getStaticInvoices();
    this.applyFilters();
    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment below for API integration
    /*
    this.invoiceService.getInvoicesByUser(this.currentUser?.id).subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.applyFilters();
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  private getStaticInvoices(): Invoice[] {
    return [
      {
        id: 1,
        invoiceNumber: 'INV-2024-001',
        clientId: 1,
        clientName: 'Tech Solutions Inc.',
        clientEmail: 'billing@techsolutions.com',
        issueDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        items: [
          { id: 1, description: 'Web Development Services', quantity: 40, unitPrice: 75, total: 3000 },
          { id: 2, description: 'UI/UX Design', quantity: 20, unitPrice: 85, total: 1700 }
        ],
        subtotal: 4700,
        taxRate: 8.5,
        taxAmount: 399.5,
        totalAmount: 5099.5,
        status: InvoiceStatus.PAID,
        notes: 'Monthly web development project',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 2,
        invoiceNumber: 'INV-2024-002',
        clientId: 2,
        clientName: 'Digital Marketing Agency',
        clientEmail: 'accounts@digitalmkt.com',
        issueDate: new Date('2024-02-01'),
        dueDate: new Date('2024-03-01'),
        items: [
          { id: 3, description: 'SEO Optimization', quantity: 1, unitPrice: 2500, total: 2500 },
          { id: 4, description: 'Content Creation', quantity: 10, unitPrice: 150, total: 1500 }
        ],
        subtotal: 4000,
        taxRate: 8.5,
        taxAmount: 340,
        totalAmount: 4340,
        status: InvoiceStatus.SENT,
        notes: 'SEO and content marketing services',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        id: 3,
        invoiceNumber: 'INV-2024-003',
        clientId: 3,
        clientName: 'StartupXYZ',
        clientEmail: 'finance@startupxyz.com',
        issueDate: new Date('2024-01-20'),
        dueDate: new Date('2024-02-20'),
        items: [
          { id: 5, description: 'Mobile App Development', quantity: 80, unitPrice: 90, total: 7200 }
        ],
        subtotal: 7200,
        taxRate: 8.5,
        taxAmount: 612,
        totalAmount: 7812,
        status: InvoiceStatus.OVERDUE,
        notes: 'iOS and Android app development',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 4,
        invoiceNumber: 'INV-2024-004',
        clientId: 1,
        clientName: 'Tech Solutions Inc.',
        clientEmail: 'billing@techsolutions.com',
        issueDate: new Date('2024-03-01'),
        dueDate: new Date('2024-04-01'),
        items: [
          { id: 6, description: 'API Development', quantity: 30, unitPrice: 100, total: 3000 },
          { id: 7, description: 'Database Design', quantity: 15, unitPrice: 120, total: 1800 }
        ],
        subtotal: 4800,
        taxRate: 8.5,
        taxAmount: 408,
        totalAmount: 5208,
        status: InvoiceStatus.DRAFT,
        notes: 'Backend API and database services',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ];
  }

  applyFilters(): void {
    let filtered = this.invoices;

    // Filter by status
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(invoice => invoice.status === this.statusFilter);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.clientName.toLowerCase().includes(term) ||
        invoice.clientEmail.toLowerCase().includes(term)
      );
    }

    this.filteredInvoices = filtered;
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  getStatusBadgeClass(status: InvoiceStatus): string {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return 'badge-draft';
      case InvoiceStatus.SENT:
        return 'badge-sent';
      case InvoiceStatus.PAID:
        return 'badge-paid';
      case InvoiceStatus.OVERDUE:
        return 'badge-overdue';
      case InvoiceStatus.CANCELLED:
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  }

  getStatusLabel(status: InvoiceStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  isOverdue(invoice: Invoice): boolean {
    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
      return false;
    }
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    return dueDate < today;
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/fintech/invoices', invoice.id]);
  }

  editInvoice(invoice: Invoice): void {
    this.router.navigate(['/fintech/invoices', invoice.id, 'edit']);
  }

  sendInvoice(invoice: Invoice): void {
    if (confirm('Are you sure you want to send this invoice to the client?')) {
      this.invoiceService.sendInvoice(invoice.id).subscribe({
        next: (updatedInvoice) => {
          const index = this.invoices.findIndex(inv => inv.id === invoice.id);
          if (index !== -1) {
            this.invoices[index] = updatedInvoice;
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error sending invoice:', error);
        }
      });
    }
  }

  markAsPaid(invoice: Invoice): void {
    if (confirm('Are you sure you want to mark this invoice as paid?')) {
      this.invoiceService.markAsPaid(invoice.id).subscribe({
        next: (updatedInvoice) => {
          const index = this.invoices.findIndex(inv => inv.id === invoice.id);
          if (index !== -1) {
            this.invoices[index] = updatedInvoice;
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error marking invoice as paid:', error);
        }
      });
    }
  }

  deleteInvoice(invoice: Invoice): void {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      this.invoiceService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.invoices = this.invoices.filter(inv => inv.id !== invoice.id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
        }
      });
    }
  }

  createNewInvoice(): void {
    this.router.navigate(['/fintech/invoices/create']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  getPaidInvoicesCount(): number {
    return this.invoices.filter(i => i.status === 'PAID').length;
  }

  getSentInvoicesCount(): number {
    return this.invoices.filter(i => i.status === 'SENT').length;
  }

  getTotalRevenue(): string {
    const total = this.invoices
      .filter(i => i.status === 'PAID')
      .reduce((sum, i) => sum + i.totalAmount, 0);
    return this.formatCurrency(total);
  }
}
