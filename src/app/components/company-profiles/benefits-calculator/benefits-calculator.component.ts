import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyProfile, CompanyBenefit, BenefitCategory } from '../../../models/company-profile.model';

@Component({
  selector: 'app-benefits-calculator',
  standalone: false,
  templateUrl: './benefits-calculator.component.html',
  styleUrl: './benefits-calculator.component.scss'
})
export class BenefitsCalculatorComponent implements OnInit {
  @Input() companyProfile: CompanyProfile | null = null;

  calculatorForm: FormGroup;
  calculationResult: any = null;
  showResults = false;

  // Calculator inputs
  salaryOptions = [
    { value: 30000, label: '30 000 €' },
    { value: 35000, label: '35 000 €' },
    { value: 40000, label: '40 000 €' },
    { value: 45000, label: '45 000 €' },
    { value: 50000, label: '50 000 €' },
    { value: 60000, label: '60 000 €' },
    { value: 70000, label: '70 000 €' },
    { value: 80000, label: '80 000 €' },
    { value: 90000, label: '90 000 €' },
    { value: 100000, label: '100 000 € +' }
  ];

  experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 ans)', multiplier: 0.8 },
    { value: 'mid', label: 'Intermédiaire (2-5 ans)', multiplier: 1.0 },
    { value: 'senior', label: 'Senior (5-10 ans)', multiplier: 1.2 },
    { value: 'expert', label: 'Expert (10+ ans)', multiplier: 1.4 }
  ];

  constructor(private fb: FormBuilder) {
    this.calculatorForm = this.fb.group({
      baseSalary: [50000, [Validators.required, Validators.min(20000)]],
      experienceLevel: ['mid', Validators.required],
      includeBenefits: [true],
      includeBonuses: [true],
      location: ['paris', Validators.required]
    });
  }

  ngOnInit(): void {
    this.calculatorForm.valueChanges.subscribe(() => {
      if (this.calculatorForm.valid) {
        this.calculateBenefits();
      }
    });

    // Initial calculation
    this.calculateBenefits();
  }

  calculateBenefits(): void {
    if (!this.companyProfile || !this.calculatorForm.valid) return;

    const formValue = this.calculatorForm.value;
    const baseSalary = formValue.baseSalary;
    const experienceLevel = this.experienceLevels.find(level => level.value === formValue.experienceLevel);
    const experienceMultiplier = experienceLevel ? experienceLevel.multiplier : 1;

    // Calculate adjusted salary based on experience
    const adjustedSalary = baseSalary * experienceMultiplier;

    // Calculate benefits value
    let totalBenefitsValue = 0;
    const benefitsBreakdown: any[] = [];

    if (formValue.includeBenefits && this.companyProfile.benefits) {
      this.companyProfile.benefits.forEach(benefit => {
        if (benefit.isActive && benefit.value) {
          totalBenefitsValue += benefit.value;
          benefitsBreakdown.push({
            name: benefit.name,
            value: benefit.value,
            category: benefit.category
          });
        }
      });
    }

    // Estimate bonuses (typically 10-20% of salary)
    let estimatedBonuses = 0;
    if (formValue.includeBonuses) {
      estimatedBonuses = adjustedSalary * 0.15; // 15% average bonus
    }

    // Location adjustment (simplified)
    const locationMultiplier = formValue.location === 'paris' ? 1.1 : 1.0;

    const totalCompensation = (adjustedSalary + totalBenefitsValue + estimatedBonuses) * locationMultiplier;

    this.calculationResult = {
      baseSalary: adjustedSalary,
      benefitsValue: totalBenefitsValue,
      estimatedBonuses: estimatedBonuses,
      locationAdjustment: locationMultiplier,
      totalCompensation: totalCompensation,
      benefitsBreakdown: benefitsBreakdown,
      monthlyGross: totalCompensation / 12,
      monthlyNet: this.calculateNetMonthly(totalCompensation / 12),
      annualNet: this.calculateNetMonthly(totalCompensation / 12) * 12
    };

    this.showResults = true;
  }

  private calculateNetMonthly(grossMonthly: number): number {
    // Simplified French tax calculation (many approximations)
    // This is a very basic calculation - in reality, taxes are much more complex
    const socialContributions = grossMonthly * 0.22; // Approximate social charges
    const incomeTax = Math.max(0, (grossMonthly * 12 - 10000) * 0.12 / 12); // Simplified income tax

    return grossMonthly - socialContributions - incomeTax;
  }

  getCategoryIcon(category: BenefitCategory): string {
    switch (category) {
      case BenefitCategory.HEALTH: return 'fas fa-heartbeat';
      case BenefitCategory.FINANCIAL: return 'fas fa-euro-sign';
      case BenefitCategory.PROFESSIONAL_DEVELOPMENT: return 'fas fa-graduation-cap';
      case BenefitCategory.WORK_LIFE_BALANCE: return 'fas fa-balance-scale';
      case BenefitCategory.PERKS: return 'fas fa-gift';
      case BenefitCategory.INSURANCE: return 'fas fa-shield-alt';
      default: return 'fas fa-star';
    }
  }

  getCategoryName(category: BenefitCategory): string {
    switch (category) {
      case BenefitCategory.HEALTH: return 'Santé';
      case BenefitCategory.FINANCIAL: return 'Financier';
      case BenefitCategory.PROFESSIONAL_DEVELOPMENT: return 'Développement';
      case BenefitCategory.WORK_LIFE_BALANCE: return 'Équilibre vie pro';
      case BenefitCategory.PERKS: return 'Avantages';
      case BenefitCategory.INSURANCE: return 'Assurance';
      default: return category;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  resetCalculator(): void {
    this.calculatorForm.patchValue({
      baseSalary: 50000,
      experienceLevel: 'mid',
      includeBenefits: true,
      includeBonuses: true,
      location: 'paris'
    });
  }
}
