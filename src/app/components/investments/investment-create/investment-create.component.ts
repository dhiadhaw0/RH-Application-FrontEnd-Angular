import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillInvestmentService } from '../../../services/skill-investment.service';
import { SkillCreditService } from '../../../services/skill-credit.service';
import { AuthService } from '../../../services/auth.service';
import { SkillInvestmentFund, InvestmentFundType } from '../../../models/skill-investment.model';

@Component({
  selector: 'app-investment-create',
  standalone: false,
  templateUrl: './investment-create.component.html',
  styleUrl: './investment-create.component.scss'
})
export class InvestmentCreateComponent implements OnInit {
  investmentForm: FormGroup;
  selectedFund: SkillInvestmentFund | null = null;
  availableFunds: SkillInvestmentFund[] = [];
  creditBalance: any = {};
  loading = false;
  submitting = false;

  fundTypes = [
    { value: 'FORMATION_PERFORMANCE', label: 'Performance Formation' },
    { value: 'CAREER_PROGRESSION', label: 'Progression Carrière' },
    { value: 'MENTORSHIP_SUCCESS', label: 'Succès Mentorat' },
    { value: 'GENERAL_SKILLS', label: 'Compétences Générales' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private investmentService: SkillInvestmentService,
    private skillCreditService: SkillCreditService,
    private authService: AuthService
  ) {
    this.investmentForm = this.fb.group({
      fundId: ['', Validators.required],
      creditsAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.checkForFundId();
  }

  loadData(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    // Load available funds
    this.investmentService.getAllFunds().subscribe({
      next: (funds) => {
        this.availableFunds = funds.filter(fund => fund.status === 'ACTIVE');
      },
      error: (error) => console.error('Error loading funds:', error)
    });

    // Load credit balance
    this.skillCreditService.getCreditBalance(userId).subscribe({
      next: (balance) => {
        this.creditBalance = balance;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading credit balance:', error);
        this.loading = false;
      }
    });
  }

  checkForFundId(): void {
    this.route.queryParams.subscribe(params => {
      if (params['fundId']) {
        const fundId = +params['fundId'];
        this.investmentForm.patchValue({ fundId });
        this.onFundChange();
      }
    });
  }

  onFundChange(): void {
    const fundId = this.investmentForm.value.fundId;
    if (fundId) {
      this.selectedFund = this.availableFunds.find(fund => fund.id === +fundId) || null;
      if (this.selectedFund) {
        this.investmentForm.patchValue({
          creditsAmount: Math.min(this.selectedFund.minInvestment, this.creditBalance.availableCredits || 0)
        });
      }
    } else {
      this.selectedFund = null;
    }
  }

  onSubmit(): void {
    if (this.investmentForm.valid) {
      this.submitting = true;
      const formValue = this.investmentForm.value;
      const user = this.authService.getCurrentUser();
      const userId = user?.id || 1;

      this.investmentService.investInFund(userId, formValue.fundId, formValue.creditsAmount).subscribe({
        next: (investment) => {
          this.submitting = false;
          // Redirect to dashboard with success message
          this.router.navigate(['/investments/dashboard'], {
            queryParams: { success: 'investment_created' }
          });
        },
        error: (error) => {
          console.error('Error creating investment:', error);
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.investmentForm.controls).forEach(key => {
      const control = this.investmentForm.get(key);
      control?.markAsTouched();
    });
  }

  getFundTypeLabel(type: InvestmentFundType): string {
    const typeMap = {
      'FORMATION_PERFORMANCE': 'Performance Formation',
      'CAREER_PROGRESSION': 'Progression Carrière',
      'MENTORSHIP_SUCCESS': 'Succès Mentorat',
      'GENERAL_SKILLS': 'Compétences Générales'
    };
    return typeMap[type] || type;
  }

  canInvest(): boolean {
    const creditsAmount = this.investmentForm.value.creditsAmount || 0;
    const availableCredits = this.creditBalance.availableCredits || 0;
    const minInvestment = this.selectedFund?.minInvestment || 0;

    return creditsAmount >= minInvestment && creditsAmount <= availableCredits;
  }
}
