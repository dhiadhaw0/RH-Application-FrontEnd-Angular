import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { Payment, PaymentStatus, PaymentMethod } from '../../../models/payment.model';
import { Invoice, InvoiceStatus } from '../../../models/invoice.model';

@Component({
  selector: 'app-payment-dashboard',
  standalone: false,
  templateUrl: './payment-dashboard.component.html',
  styleUrl: './payment-dashboard.component.scss'
})
export class PaymentDashboardComponent implements OnInit {
  payments: Payment[] = [];
  pendingInvoices: Invoice[] = [];
  isLoading = false;
  currentUser: any;
  selectedInvoice: Invoice | null = null;
  paymentAmount: number = 0;
  stripe: any;

  paymentMethods = [
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Debit Card' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' },
    { value: PaymentMethod.PAYPAL, label: 'PayPal' }
  ];

  constructor(
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPayments();
    this.loadPendingInvoices();

    // Load Stripe if available
    if ((window as any).Stripe) {
      this.stripe = (window as any).Stripe('your-stripe-publishable-key'); // Replace with actual key
    }
  }

  loadPayments(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.payments = this.getStaticPayments();
    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment below for API integration
    /*
    this.paymentService.getPaymentsByUser(this.currentUser?.id).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  loadPendingInvoices(): void {
    // Use static data for demonstration
    this.pendingInvoices = this.getStaticPendingInvoices();

    // Uncomment below for API integration
    /*
    this.invoiceService.getInvoicesByUser(this.currentUser?.id).subscribe({
      next: (invoices) => {
        this.pendingInvoices = invoices.filter(invoice =>
          invoice.status === 'SENT' || invoice.status === 'OVERDUE'
        );
      },
      error: (error) => {
        console.error('Error loading pending invoices:', error);
      }
    });
    */
  }

  private getStaticPayments(): Payment[] {
    return [
      {
        id: 1,
        invoiceId: 1,
        amount: 5099.5,
        currency: 'USD',
        paymentMethod: PaymentMethod.STRIPE,
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_1234567890',
        paymentDate: new Date('2024-01-20'),
        notes: 'Payment for web development services',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 2,
        invoiceId: 2,
        amount: 4340,
        currency: 'USD',
        paymentMethod: PaymentMethod.PAYPAL,
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_0987654321',
        paymentDate: new Date('2024-02-15'),
        notes: 'SEO and content marketing services',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: 3,
        invoiceId: 3,
        amount: 7812,
        currency: 'USD',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        status: PaymentStatus.PENDING,
        paymentDate: new Date('2024-02-25'),
        notes: 'Mobile app development - awaiting bank transfer',
        createdAt: new Date('2024-02-25'),
        updatedAt: new Date('2024-02-25')
      }
    ];
  }

  private getStaticPendingInvoices(): Invoice[] {
    return [
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
      }
    ];
  }

  selectInvoiceForPayment(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.paymentAmount = invoice.totalAmount;
  }

  processPayment(): void {
    if (!this.selectedInvoice || this.paymentAmount <= 0) return;

    this.isLoading = true;
    this.loadingService.showLoader();

    const paymentData = {
      invoiceId: this.selectedInvoice.id,
      amount: this.paymentAmount,
      paymentMethod: PaymentMethod.STRIPE,
      currency: 'usd'
    };

    this.paymentService.processPayment(paymentData).subscribe({
      next: (payment) => {
        this.isLoading = false;
        this.loadingService.hideLoader();
        this.loadPayments();
        this.loadPendingInvoices();
        this.selectedInvoice = null;
        this.paymentAmount = 0;
        alert('Payment processed successfully!');
      },
      error: (error) => {
        console.error('Error processing payment:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
        alert('Payment failed. Please try again.');
      }
    });
  }

  createPaymentIntent(): void {
    if (!this.selectedInvoice) return;

    this.paymentService.createPaymentIntent(this.paymentAmount, 'usd').subscribe({
      next: (paymentIntent) => {
        // Handle Stripe payment intent
        this.confirmStripePayment(paymentIntent.clientSecret);
      },
      error: (error) => {
        console.error('Error creating payment intent:', error);
      }
    });
  }

  confirmStripePayment(clientSecret: string): void {
    if (!this.stripe) {
      alert('Stripe is not loaded. Please refresh the page.');
      return;
    }

    this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.stripe.elements().create('card'),
        billing_details: {
          name: this.currentUser?.firstName + ' ' + this.currentUser?.lastName,
          email: this.currentUser?.email
        }
      }
    }).then((result: any) => {
      if (result.error) {
        console.error('Payment failed:', result.error);
        alert('Payment failed: ' + result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          this.processPayment();
        }
      }
    });
  }

  getStatusBadgeClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'badge-pending';
      case PaymentStatus.COMPLETED:
        return 'badge-completed';
      case PaymentStatus.FAILED:
        return 'badge-failed';
      case PaymentStatus.REFUNDED:
        return 'badge-refunded';
      default:
        return 'badge-default';
    }
  }

  getStatusLabel(status: PaymentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  getMethodLabel(method: PaymentMethod): string {
    const methodObj = this.paymentMethods.find(m => m.value === method);
    return methodObj ? methodObj.label : method;
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

  cancelPayment(): void {
    this.selectedInvoice = null;
    this.paymentAmount = 0;
  }

  getSuccessfulPaymentsCount(): number {
    return this.payments.filter(p => p.status === 'COMPLETED').length;
  }

  getTotalPaidAmount(): string {
    const total = this.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
    return this.formatCurrency(total);
  }
}
