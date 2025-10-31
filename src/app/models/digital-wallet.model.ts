export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD'
}

export interface DigitalWallet {
  id: number;
  userId: number;
  walletNumber: string;
  balance: number;
  currency: Currency;
  status: WalletStatus;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  subscriptions: Subscription[];
}

export interface Transaction {
  id: number;
  walletId: number;
  type: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  referenceId?: string; // Invoice ID, subscription ID, etc.
  status: TransactionStatus;
  paymentMethodId?: number;
  exchangeRate?: number;
  originalAmount?: number;
  originalCurrency?: Currency;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  TRANSFER = 'TRANSFER',
  SUBSCRIPTION = 'SUBSCRIPTION',
  FEE = 'FEE',
  EXCHANGE = 'EXCHANGE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentMethod {
  id: number;
  userId: number;
  walletId: number;
  type: PaymentMethodType;
  provider: PaymentProvider;
  lastFour: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isVerified: boolean;
  nickname?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY'
}

export enum PaymentProvider {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  BANK_OF_AMERICA = 'BANK_OF_AMERICA',
  CHASE = 'CHASE',
  WELLS_FARGO = 'WELLS_FARGO'
}

export interface Subscription {
  id: number;
  userId: number;
  walletId: number;
  paymentMethodId: number;
  name: string;
  description: string;
  amount: number;
  currency: Currency;
  frequency: SubscriptionFrequency;
  nextBillingDate: string | Date;
  status: SubscriptionStatus;
  autoRenew: boolean;
  trialEndDate?: string | Date;
  cancelAtPeriodEnd: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  billingHistory: SubscriptionBilling[];
}

export enum SubscriptionFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIALING = 'TRIALING',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  UNPAID = 'UNPAID'
}

export interface SubscriptionBilling {
  id: number;
  subscriptionId: number;
  amount: number;
  currency: Currency;
  billingDate: string | Date;
  status: TransactionStatus;
  invoiceId?: number;
}