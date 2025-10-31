import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstallmentPaymentService } from '../../../services/installment-payment.service';
import { AuthService } from '../../../services/auth.service';
import { SkillCreditService } from '../../../services/skill-credit.service';
import { InstallmentEligibility, InstallmentFrequency, InstallmentStatus } from '../../../models/installment-payment.model';

@Component({
  selector: 'app-installment-calculator',
  standalone: false,
  templateUrl: './installment-calculator.component.html',
  styleUrl: './installment-calculator.component.scss'
})
export class InstallmentCalculatorComponent implements OnInit {
  @Input() formationId: number = 0;
  @Input() formationTitle: string = '';
  @Input() totalAmount: number = 0;
  @Output() planCreated = new EventEmitter<any>();

  // Calculator inputs
  downPayment: number = 0;
  numberOfInstallments: number = 3;
  frequency: InstallmentFrequency = InstallmentFrequency.MONTHLY;

  // Calculator results
  installmentAmount: number = 0;
  totalInterest: number = 0;
  totalPayable: number = 0;
  schedule: any[] = [];

  // Eligibility
  eligibility: InstallmentEligibility | null = null;
  creditBalance: any = {};

  // UI state
  loading = false;
  showCalculator = false;
  step: 'eligibility' | 'calculator' | 'confirmation' = 'eligibility';

  frequencyOptions = [
    { value: InstallmentFrequency.MONTHLY, label: 'Mensuel' },
    { value: InstallmentFrequency.QUARTERLY, label: 'Trimestriel' },
    { value: InstallmentFrequency.WEEKLY, label: 'Hebdomadaire' }
  ];

  installmentOptions = [3, 6, 9, 12, 18, 24];

  constructor(
    private installmentService: InstallmentPaymentService,
    private authService: AuthService,
    private skillCreditService: SkillCreditService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get data from route query params if not provided as inputs
    this.route.queryParams.subscribe(params => {
      this.formationId = this.formationId || +params['formationId'] || 0;
      this.formationTitle = this.formationTitle || params['formationTitle'] || '';
      this.totalAmount = this.totalAmount || +params['totalAmount'] || 0;

      if (this.formationId && this.totalAmount) {
        this.checkEligibility();
        this.loadCreditBalance();
      }
    });
  }

  checkEligibility(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    this.installmentService.checkInstallmentEligibility(userId, this.formationId, this.totalAmount).subscribe({
      next: (eligibility) => {
        this.eligibility = eligibility;
        this.loading = false;
        if (eligibility.isEligible) {
          this.step = 'calculator';
          this.calculateInstallments();
        }
      },
      error: (error) => {
        console.error('Error checking eligibility:', error);
        this.loading = false;
      }
    });
  }

  loadCreditBalance(): void {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    this.skillCreditService.getCreditBalance(userId).subscribe({
      next: (balance) => {
        this.creditBalance = balance;
      },
      error: (error) => console.error('Error loading credit balance:', error)
    });
  }

  calculateInstallments(): void {
    // Validation des entrées
    if (this.downPayment < 0) {
      this.downPayment = 0;
    }

    if (this.downPayment >= this.totalAmount) {
      this.downPayment = this.totalAmount * 0.1; // Minimum 10% acompte
    }

    const remainingAmount = this.totalAmount - this.downPayment;

    if (remainingAmount <= 0) {
      this.installmentAmount = 0;
      this.totalInterest = 0;
      this.totalPayable = this.totalAmount;
      this.schedule = [];
      return;
    }

    // Calcul des intérêts selon la fréquence
    let interestRate = 0;
    let periodsPerYear = 12;

    switch (this.frequency) {
      case InstallmentFrequency.MONTHLY:
        interestRate = 0.0599; // 5.99% annuel
        periodsPerYear = 12;
        break;
      case InstallmentFrequency.QUARTERLY:
        interestRate = 0.0629; // 6.29% annuel
        periodsPerYear = 4;
        break;
      case InstallmentFrequency.WEEKLY:
        interestRate = 0.0699; // 6.99% annuel
        periodsPerYear = 52;
        break;
    }

    const periodicRate = interestRate / periodsPerYear;

    // Calcul du montant des échéances avec formule d'amortissement
    if (periodicRate === 0) {
      // Pas d'intérêt
      this.installmentAmount = remainingAmount / this.numberOfInstallments;
      this.totalInterest = 0;
    } else {
      // Avec intérêts composés
      const factor = Math.pow(1 + periodicRate, this.numberOfInstallments);
      this.installmentAmount = remainingAmount * (periodicRate * factor) / (factor - 1);
      this.totalInterest = (this.installmentAmount * this.numberOfInstallments) - remainingAmount;
    }

    this.totalPayable = this.downPayment + (this.installmentAmount * this.numberOfInstallments);

    // Génération de l'échéancier
    this.generateSchedule();
  }

  generateSchedule(): void {
    this.schedule = [];
    let remainingBalance = this.totalAmount - this.downPayment;
    const periodicRate = this.getPeriodicRate();

    // Acompte initial
    if (this.downPayment > 0) {
      this.schedule.push({
        number: 0,
        date: new Date(),
        payment: this.downPayment,
        principal: this.downPayment,
        interest: 0,
        balance: remainingBalance,
        type: 'down_payment'
      });
    }

    // Échéances
    for (let i = 1; i <= this.numberOfInstallments; i++) {
      const interestPayment = remainingBalance * periodicRate;
      const principalPayment = this.installmentAmount - interestPayment;
      remainingBalance -= principalPayment;

      const paymentDate = new Date();
      switch (this.frequency) {
        case InstallmentFrequency.MONTHLY:
          paymentDate.setMonth(paymentDate.getMonth() + i);
          break;
        case InstallmentFrequency.QUARTERLY:
          paymentDate.setMonth(paymentDate.getMonth() + (i * 3));
          break;
        case InstallmentFrequency.WEEKLY:
          paymentDate.setDate(paymentDate.getDate() + (i * 7));
          break;
      }

      this.schedule.push({
        number: i,
        date: paymentDate,
        payment: this.installmentAmount,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
        type: 'installment'
      });
    }
  }

  getPeriodicRate(): number {
    const annualRate = 0.0599; // 5.99%
    switch (this.frequency) {
      case InstallmentFrequency.MONTHLY:
        return annualRate / 12;
      case InstallmentFrequency.QUARTERLY:
        return annualRate / 4;
      case InstallmentFrequency.WEEKLY:
        return annualRate / 52;
      default:
        return annualRate / 12;
    }
  }

  onDownPaymentChange(): void {
    // Validation de l'acompte
    if (this.downPayment < 0) {
      this.downPayment = 0;
    }

    const minDownPayment = this.getMinDownPayment();
    if (this.downPayment < minDownPayment) {
      this.downPayment = minDownPayment;
    }

    if (this.downPayment > this.totalAmount) {
      this.downPayment = this.totalAmount;
    }

    this.calculateInstallments();
  }

  onInstallmentsChange(): void {
    // Validation du nombre d'échéances
    const maxInstallments = this.getMaxInstallments();
    if (this.numberOfInstallments > maxInstallments) {
      this.numberOfInstallments = maxInstallments;
    }

    if (this.numberOfInstallments < 1) {
      this.numberOfInstallments = 1;
    }

    this.calculateInstallments();
  }

  onFrequencyChange(): void {
    // Ajustement automatique du nombre d'échéances selon la fréquence
    switch (this.frequency) {
      case InstallmentFrequency.WEEKLY:
        if (this.numberOfInstallments > 52) {
          this.numberOfInstallments = 52; // Maximum 1 an
        }
        break;
      case InstallmentFrequency.MONTHLY:
        if (this.numberOfInstallments > 24) {
          this.numberOfInstallments = 24; // Maximum 2 ans
        }
        break;
      case InstallmentFrequency.QUARTERLY:
        if (this.numberOfInstallments > 8) {
          this.numberOfInstallments = 8; // Maximum 2 ans
        }
        break;
    }

    this.calculateInstallments();
  }

  // Méthodes utilitaires pour les calculs
  getMonthlyPayment(): number {
    return this.installmentAmount;
  }

  getTotalSavings(): number {
    return this.totalAmount - this.totalPayable;
  }

  getInterestRate(): number {
    switch (this.frequency) {
      case InstallmentFrequency.MONTHLY:
        return 5.99;
      case InstallmentFrequency.QUARTERLY:
        return 6.29;
      case InstallmentFrequency.WEEKLY:
        return 6.99;
      default:
        return 5.99;
    }
  }

  // Validation des données d'entrée
  isValidInput(): boolean {
    return this.totalAmount > 0 &&
           this.downPayment >= 0 &&
           this.downPayment <= this.totalAmount &&
           this.numberOfInstallments >= 1 &&
           this.numberOfInstallments <= this.getMaxInstallments();
  }

  // Formatage pour l'affichage
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  createInstallmentPlan(): void {
    if (!this.isValidInput()) {
      console.error('Invalid input data');
      return;
    }

    this.loading = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    const planData = {
      userId,
      formationId: this.formationId,
      formationTitle: this.formationTitle,
      totalAmount: this.totalAmount,
      downPayment: this.downPayment,
      installmentAmount: this.installmentAmount,
      numberOfInstallments: this.numberOfInstallments,
      frequency: this.frequency,
      interestRate: this.getInterestRate(),
      totalInterest: this.totalInterest,
      totalPayable: this.totalPayable,
      schedule: this.schedule,
      skillCreditsGuarantee: Math.min(this.creditBalance.availableCredits || 0, this.totalAmount * 0.5),
      createdAt: new Date(),
      status: InstallmentStatus.ACTIVE
    };

    this.installmentService.createInstallmentPlan(planData).subscribe({
      next: (plan) => {
        this.loading = false;
        this.step = 'confirmation';
        this.planCreated.emit(plan);
        console.log('Installment plan created successfully:', plan);
      },
      error: (error) => {
        console.error('Error creating installment plan:', error);
        this.loading = false;
        // TODO: Show error message to user
      }
    });
  }

  resetCalculator(): void {
    this.step = 'eligibility';
    this.downPayment = 0;
    this.numberOfInstallments = 3;
    this.frequency = InstallmentFrequency.MONTHLY;
    this.installmentAmount = 0;
    this.totalInterest = 0;
    this.totalPayable = 0;
    this.schedule = [];
  }

  getFrequencyLabel(frequency: InstallmentFrequency): string {
    const option = this.frequencyOptions.find(opt => opt.value === frequency);
    return option ? option.label : frequency;
  }

  getMinDownPayment(): number {
    return this.eligibility?.minDownPayment || this.totalAmount * 0.1;
  }

  getMaxInstallments(): number {
    return this.eligibility?.maxInstallments || 12;
  }
}
