import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../services/subscription.service';
import { PaymentMethodService } from '../../../services/payment-method.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionFrequency,
  Currency,
  PaymentMethod
} from '../../../models/digital-wallet.model';

@Component({
  selector: 'app-subscriptions',
  standalone: false,
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;
  showAddForm = false;
  editingSubscription: Subscription | null = null;
  currentUser: any;

  // Computed properties for template
  get activeSubscriptions(): Subscription[] {
    return this.subscriptions.filter(s => s.status === SubscriptionStatus.ACTIVE || s.status === SubscriptionStatus.TRIALING);
  }

  get pausedSubscriptions(): Subscription[] {
    return this.subscriptions.filter(s => s.status === SubscriptionStatus.PAST_DUE);
  }

  get cancelledSubscriptions(): Subscription[] {
    return this.subscriptions.filter(s => s.status === SubscriptionStatus.CANCELLED);
  }

  get allSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  // Form
  subscriptionForm: FormGroup;

  // Available options
  frequencies = Object.values(SubscriptionFrequency);
  currencies = Object.values(Currency);
  statuses = Object.values(SubscriptionStatus);

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private paymentMethodService: PaymentMethodService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(500)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      currency: [Currency.USD, Validators.required],
      frequency: [SubscriptionFrequency.MONTHLY, Validators.required],
      paymentMethodId: ['', Validators.required],
      autoRenew: [true],
      trialEndDate: [''],
      cancelAtPeriodEnd: [false]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSubscriptions();
    this.loadPaymentMethods();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.subscriptions = this.getStaticSubscriptions();

    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment for API integration
    /*
    this.subscriptionService.getUserSubscriptions(this.currentUser?.id).subscribe({
      next: (subs) => {
        this.subscriptions = subs;
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  loadPaymentMethods(): void {
    // Use static data for demonstration
    this.paymentMethods = this.getStaticPaymentMethods();

    // Uncomment for API integration
    /*
    this.paymentMethodService.getUserPaymentMethods(this.currentUser?.id).subscribe({
      next: (methods) => {
        this.paymentMethods = methods.filter(m => m.isVerified);
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
    */
  }

  showAddSubscription(): void {
    this.showAddForm = true;
    this.editingSubscription = null;
    this.subscriptionForm.reset({
      currency: Currency.USD,
      frequency: SubscriptionFrequency.MONTHLY,
      autoRenew: true,
      cancelAtPeriodEnd: false
    });
  }

  editSubscription(subscription: Subscription): void {
    this.showAddForm = true;
    this.editingSubscription = subscription;
    this.subscriptionForm.patchValue({
      name: subscription.name,
      description: subscription.description,
      amount: subscription.amount,
      currency: subscription.currency,
      frequency: subscription.frequency,
      paymentMethodId: subscription.paymentMethodId,
      autoRenew: subscription.autoRenew,
      trialEndDate: subscription.trialEndDate ? new Date(subscription.trialEndDate).toISOString().split('T')[0] : '',
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
    });
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingSubscription = null;
    this.subscriptionForm.reset();
  }

  saveSubscription(): void {
    if (this.subscriptionForm.valid) {
      this.loadingService.showLoader();

      const formValue = this.subscriptionForm.value;
      const subscriptionData: Partial<Subscription> = {
        userId: this.currentUser?.id,
        walletId: 1, // Default wallet
        name: formValue.name,
        description: formValue.description,
        amount: formValue.amount,
        currency: formValue.currency,
        frequency: formValue.frequency,
        paymentMethodId: formValue.paymentMethodId,
        autoRenew: formValue.autoRenew,
        cancelAtPeriodEnd: formValue.cancelAtPeriodEnd,
        status: SubscriptionStatus.ACTIVE,
        nextBillingDate: this.calculateNextBillingDate(formValue.frequency)
      };

      if (formValue.trialEndDate) {
        subscriptionData.trialEndDate = new Date(formValue.trialEndDate);
        subscriptionData.status = SubscriptionStatus.TRIALING;
      }

      if (this.editingSubscription) {
        // Update existing subscription
        this.subscriptionService.updateSubscription(this.editingSubscription.id, subscriptionData).subscribe({
          next: (updatedSub) => {
            const index = this.subscriptions.findIndex(s => s.id === updatedSub.id);
            if (index !== -1) {
              this.subscriptions[index] = updatedSub;
            }
            this.cancelEdit();
            this.loadingService.hideLoader();
            alert('Subscription updated successfully!');
          },
          error: (error) => {
            console.error('Error updating subscription:', error);
            this.loadingService.hideLoader();
            alert('Failed to update subscription. Please try again.');
          }
        });
      } else {
        // Create new subscription
        this.subscriptionService.createSubscription(subscriptionData).subscribe({
          next: (newSub) => {
            this.subscriptions.push(newSub);
            this.cancelEdit();
            this.loadingService.hideLoader();
            alert('Subscription created successfully!');
          },
          error: (error) => {
            console.error('Error creating subscription:', error);
            this.loadingService.hideLoader();
            alert('Failed to create subscription. Please try again.');
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.subscriptionForm);
    }
  }

  cancelSubscription(subscription: Subscription): void {
    const message = subscription.cancelAtPeriodEnd
      ? 'This subscription will be cancelled at the end of the current billing period. Continue?'
      : 'Are you sure you want to cancel this subscription immediately?';

    if (confirm(message)) {
      this.loadingService.showLoader();

      this.subscriptionService.cancelSubscription(subscription.id, !subscription.cancelAtPeriodEnd).subscribe({
        next: (updatedSub) => {
          const index = this.subscriptions.findIndex(s => s.id === updatedSub.id);
          if (index !== -1) {
            this.subscriptions[index] = updatedSub;
          }
          this.loadingService.hideLoader();
          alert('Subscription cancelled successfully!');
        },
        error: (error) => {
          console.error('Error cancelling subscription:', error);
          this.loadingService.hideLoader();
          alert('Failed to cancel subscription. Please try again.');
        }
      });
    }
  }

  reactivateSubscription(subscription: Subscription): void {
    this.loadingService.showLoader();

    this.subscriptionService.reactivateSubscription(subscription.id).subscribe({
      next: (updatedSub) => {
        const index = this.subscriptions.findIndex(s => s.id === updatedSub.id);
        if (index !== -1) {
          this.subscriptions[index] = updatedSub;
        }
        this.loadingService.hideLoader();
        alert('Subscription reactivated successfully!');
      },
      error: (error) => {
        console.error('Error reactivating subscription:', error);
        this.loadingService.hideLoader();
        alert('Failed to reactivate subscription. Please try again.');
      }
    });
  }

  getPaymentMethodName(paymentMethodId: number): string {
    const method = this.paymentMethods.find(m => m.id === paymentMethodId);
    return method ? (method.nickname || `${method.provider} ****${method.lastFour}`) : 'Unknown';
  }

  getStatusBadgeClass(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.ACTIVE: return 'badge-success';
      case SubscriptionStatus.TRIALING: return 'badge-primary';
      case SubscriptionStatus.PAST_DUE: return 'badge-warning';
      case SubscriptionStatus.CANCELLED: return 'badge-danger';
      case SubscriptionStatus.UNPAID: return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getFrequencyLabel(frequency: SubscriptionFrequency): string {
    switch (frequency) {
      case SubscriptionFrequency.DAILY: return 'Daily';
      case SubscriptionFrequency.WEEKLY: return 'Weekly';
      case SubscriptionFrequency.MONTHLY: return 'Monthly';
      case SubscriptionFrequency.QUARTERLY: return 'Quarterly';
      case SubscriptionFrequency.YEARLY: return 'Yearly';
      default: return frequency;
    }
  }

  calculateNextBillingDate(frequency: SubscriptionFrequency): Date {
    const now = new Date();
    switch (frequency) {
      case SubscriptionFrequency.DAILY:
        now.setDate(now.getDate() + 1);
        break;
      case SubscriptionFrequency.WEEKLY:
        now.setDate(now.getDate() + 7);
        break;
      case SubscriptionFrequency.MONTHLY:
        now.setMonth(now.getMonth() + 1);
        break;
      case SubscriptionFrequency.QUARTERLY:
        now.setMonth(now.getMonth() + 3);
        break;
      case SubscriptionFrequency.YEARLY:
        now.setFullYear(now.getFullYear() + 1);
        break;
    }
    return now;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Static data for demonstration
  private getStaticSubscriptions(): Subscription[] {
    return [
      {
        id: 1,
        userId: 1,
        walletId: 1,
        paymentMethodId: 1,
        name: 'Premium Mentorship',
        description: 'Monthly premium mentorship sessions',
        amount: 49.99,
        currency: Currency.USD,
        frequency: SubscriptionFrequency.MONTHLY,
        nextBillingDate: new Date('2024-11-15'),
        status: SubscriptionStatus.ACTIVE,
        autoRenew: true,
        cancelAtPeriodEnd: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        billingHistory: []
      },
      {
        id: 2,
        userId: 1,
        walletId: 1,
        paymentMethodId: 2,
        name: 'Formation Access',
        description: 'Unlimited access to premium formations',
        amount: 29.99,
        currency: Currency.USD,
        frequency: SubscriptionFrequency.MONTHLY,
        nextBillingDate: new Date('2024-11-20'),
        status: SubscriptionStatus.TRIALING,
        autoRenew: true,
        trialEndDate: new Date('2024-11-20'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2024-10-20'),
        updatedAt: new Date('2024-10-20'),
        billingHistory: []
      },
      {
        id: 3,
        userId: 1,
        walletId: 1,
        paymentMethodId: 1,
        name: 'Career Analytics',
        description: 'Advanced career analytics and insights',
        amount: 19.99,
        currency: Currency.USD,
        frequency: SubscriptionFrequency.MONTHLY,
        nextBillingDate: new Date('2024-11-10'),
        status: SubscriptionStatus.CANCELLED,
        autoRenew: false,
        cancelAtPeriodEnd: true,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-10-15'),
        billingHistory: []
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
}
