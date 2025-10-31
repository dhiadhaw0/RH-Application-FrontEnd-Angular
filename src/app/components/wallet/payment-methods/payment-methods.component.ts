import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodService } from '../../../services/payment-method.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import {
  PaymentMethod,
  PaymentMethodType,
  PaymentProvider,
  Currency
} from '../../../models/digital-wallet.model';

@Component({
  selector: 'app-payment-methods',
  standalone: false,
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss'
})
export class PaymentMethodsComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;
  showAddForm = false;
  editingMethod: PaymentMethod | null = null;
  currentUser: any;

  // Form
  paymentMethodForm: FormGroup;
  selectedType: PaymentMethodType = PaymentMethodType.CREDIT_CARD;

  // Available options
  paymentTypes = Object.values(PaymentMethodType);
  cardProviders = [PaymentProvider.VISA, PaymentProvider.MASTERCARD, PaymentProvider.AMEX, PaymentProvider.DISCOVER];
  currencies = Object.values(Currency);
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.paymentMethodForm = this.fb.group({
      type: [PaymentMethodType.CREDIT_CARD, Validators.required],
      provider: [PaymentProvider.VISA, Validators.required],
      nickname: ['', [Validators.maxLength(50)]],
      // Credit Card fields
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(new Date().getFullYear())]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      holderName: ['', [Validators.required, Validators.minLength(2)]],
      // Bank Account fields
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{8,17}$/)]],
      routingNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      accountType: ['CHECKING'],
      // PayPal fields
      email: ['', [Validators.required, Validators.email]],
      // Digital Wallet fields
      deviceId: [''],
      // Common fields
      currency: [Currency.USD, Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPaymentMethods();
    this.onTypeChange();
  }

  loadPaymentMethods(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.paymentMethods = this.getStaticPaymentMethods();

    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment for API integration
    /*
    this.paymentMethodService.getUserPaymentMethods(this.currentUser?.id).subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  onTypeChange(): void {
    this.selectedType = this.paymentMethodForm.get('type')?.value;
    this.updateFormValidators();
  }

  private updateFormValidators(): void {
    // Reset all validators
    Object.keys(this.paymentMethodForm.controls).forEach(key => {
      const control = this.paymentMethodForm.get(key);
      control?.clearValidators();
      control?.setErrors(null);
    });

    // Set validators based on type
    switch (this.selectedType) {
      case PaymentMethodType.CREDIT_CARD:
        this.paymentMethodForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{13,19}$/)]);
        this.paymentMethodForm.get('expiryMonth')?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
        this.paymentMethodForm.get('expiryYear')?.setValidators([Validators.required, Validators.min(new Date().getFullYear())]);
        this.paymentMethodForm.get('cvc')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        this.paymentMethodForm.get('holderName')?.setValidators([Validators.required, Validators.minLength(2)]);
        break;
      case PaymentMethodType.BANK_ACCOUNT:
        this.paymentMethodForm.get('accountNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{8,17}$/)]);
        this.paymentMethodForm.get('routingNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
        this.paymentMethodForm.get('accountType')?.setValidators([Validators.required]);
        this.paymentMethodForm.get('holderName')?.setValidators([Validators.required, Validators.minLength(2)]);
        break;
      case PaymentMethodType.PAYPAL:
        this.paymentMethodForm.get('email')?.setValidators([Validators.required, Validators.email]);
        break;
      case PaymentMethodType.APPLE_PAY:
      case PaymentMethodType.GOOGLE_PAY:
        this.paymentMethodForm.get('deviceId')?.setValidators([Validators.required]);
        break;
    }

    this.paymentMethodForm.get('nickname')?.setValidators([Validators.maxLength(50)]);
    this.paymentMethodForm.get('currency')?.setValidators([Validators.required]);

    // Update validity
    Object.keys(this.paymentMethodForm.controls).forEach(key => {
      this.paymentMethodForm.get(key)?.updateValueAndValidity();
    });
  }

  showAddPaymentMethod(): void {
    this.showAddForm = true;
    this.editingMethod = null;
    this.paymentMethodForm.reset({
      type: PaymentMethodType.CREDIT_CARD,
      provider: PaymentProvider.VISA,
      currency: Currency.USD
    });
    this.onTypeChange();
  }

  editPaymentMethod(method: PaymentMethod): void {
    this.showAddForm = true;
    this.editingMethod = method;
    this.paymentMethodForm.patchValue({
      type: method.type,
      provider: method.provider,
      nickname: method.nickname,
      // currency: method.currency // Not in PaymentMethod model
    });
    this.onTypeChange();
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingMethod = null;
    this.paymentMethodForm.reset();
  }

  savePaymentMethod(): void {
    if (this.paymentMethodForm.valid) {
      this.loadingService.showLoader();

      const formValue = this.paymentMethodForm.value;
      const methodData: Partial<PaymentMethod> = {
        userId: this.currentUser?.id,
        type: formValue.type,
        provider: formValue.provider,
        nickname: formValue.nickname,
        // currency: formValue.currency, // Not in PaymentMethod model
        isDefault: false,
        isVerified: false
      };

      // Add type-specific data
      switch (formValue.type) {
        case PaymentMethodType.CREDIT_CARD:
          methodData.lastFour = formValue.cardNumber.slice(-4);
          methodData.expiryMonth = formValue.expiryMonth;
          methodData.expiryYear = formValue.expiryYear;
          break;
        case PaymentMethodType.BANK_ACCOUNT:
          methodData.lastFour = formValue.accountNumber.slice(-4);
          break;
      }

      if (this.editingMethod) {
        // Update existing method
        this.paymentMethodService.updatePaymentMethod(this.editingMethod.id, methodData).subscribe({
          next: (updatedMethod) => {
            const index = this.paymentMethods.findIndex(m => m.id === updatedMethod.id);
            if (index !== -1) {
              this.paymentMethods[index] = updatedMethod;
            }
            this.cancelEdit();
            this.loadingService.hideLoader();
            alert('Payment method updated successfully!');
          },
          error: (error) => {
            console.error('Error updating payment method:', error);
            this.loadingService.hideLoader();
            alert('Failed to update payment method. Please try again.');
          }
        });
      } else {
        // Add new method
        this.paymentMethodService.addPaymentMethod(this.currentUser?.id, methodData).subscribe({
          next: (newMethod) => {
            this.paymentMethods.push(newMethod);
            this.cancelEdit();
            this.loadingService.hideLoader();
            alert('Payment method added successfully!');
          },
          error: (error) => {
            console.error('Error adding payment method:', error);
            this.loadingService.hideLoader();
            alert('Failed to add payment method. Please try again.');
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.paymentMethodForm);
    }
  }

  deletePaymentMethod(method: PaymentMethod): void {
    if (confirm(`Are you sure you want to delete this payment method?`)) {
      this.loadingService.showLoader();

      this.paymentMethodService.deletePaymentMethod(method.id).subscribe({
        next: () => {
          this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
          this.loadingService.hideLoader();
          alert('Payment method deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting payment method:', error);
          this.loadingService.hideLoader();
          alert('Failed to delete payment method. Please try again.');
        }
      });
    }
  }

  setDefaultPaymentMethod(method: PaymentMethod): void {
    this.loadingService.showLoader();

    this.paymentMethodService.setDefaultPaymentMethod(this.currentUser?.id, method.id).subscribe({
      next: () => {
        this.paymentMethods.forEach(m => m.isDefault = m.id === method.id);
        this.loadingService.hideLoader();
        alert('Default payment method updated!');
      },
      error: (error) => {
        console.error('Error setting default payment method:', error);
        this.loadingService.hideLoader();
        alert('Failed to update default payment method. Please try again.');
      }
    });
  }

  verifyPaymentMethod(method: PaymentMethod): void {
    // In a real implementation, this would trigger a verification process
    alert('Verification process would be initiated here. This is a demo.');
  }

  getPaymentMethodIcon(type: PaymentMethodType, provider: PaymentProvider): string {
    return this.paymentMethodService.getPaymentMethodIcon(type, provider);
  }

  maskCardNumber(cardNumber: string): string {
    return this.paymentMethodService.maskCardNumber(cardNumber);
  }

  formatExpiryDate(month: number, year: number): string {
    return this.paymentMethodService.formatExpiryDate(month, year);
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
  private getStaticPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 1,
        userId: 1,
        walletId: 1,
        type: PaymentMethodType.CREDIT_CARD,
        provider: PaymentProvider.VISA,
        lastFour: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
        isVerified: true,
        nickname: 'Primary Visa',
        // currency: Currency.USD, // Not in PaymentMethod model
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        userId: 1,
        walletId: 1,
        type: PaymentMethodType.PAYPAL,
        provider: PaymentProvider.PAYPAL,
        lastFour: '',
        isDefault: false,
        isVerified: true,
        nickname: 'PayPal Account',
        // currency: Currency.USD, // Not in PaymentMethod model
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        id: 3,
        userId: 1,
        walletId: 1,
        type: PaymentMethodType.BANK_ACCOUNT,
        provider: PaymentProvider.BANK_OF_AMERICA,
        lastFour: '1234',
        isDefault: false,
        isVerified: true,
        nickname: 'Checking Account',
        // currency: Currency.USD, // Not in PaymentMethod model
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ];
  }
}
