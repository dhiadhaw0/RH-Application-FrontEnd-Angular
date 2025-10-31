import { Component, OnInit } from '@angular/core';
import { SkillInvestmentService } from '../../../services/skill-investment.service';
import { SkillCreditService } from '../../../services/skill-credit.service';
import { AuthService } from '../../../services/auth.service';
import { SkillInvestment, SkillInvestmentFund } from '../../../models/skill-investment.model';

@Component({
  selector: 'app-investment-dashboard',
  standalone: false,
  templateUrl: './investment-dashboard.component.html',
  styleUrl: './investment-dashboard.component.scss'
})
export class InvestmentDashboardComponent implements OnInit {
  userInvestments: SkillInvestment[] = [];
  availableFunds: SkillInvestmentFund[] = [];
  investmentStats: any = {};
  creditBalance: any = {};
  loading = false;

  constructor(
    private investmentService: SkillInvestmentService,
    private skillCreditService: SkillCreditService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1; // Default to 1 for demo purposes

    // Load user investments
    this.investmentService.getUserInvestments(userId).subscribe({
      next: (investments) => {
        this.userInvestments = investments;
      },
      error: (error) => console.error('Error loading investments:', error)
    });

    // Load available funds
    this.investmentService.getAllFunds().subscribe({
      next: (funds) => {
        this.availableFunds = funds.filter(fund => fund.status === 'ACTIVE');
      },
      error: (error) => console.error('Error loading funds:', error)
    });

    // Load investment stats
    this.investmentService.getInvestmentStats(userId).subscribe({
      next: (stats) => {
        this.investmentStats = stats;
      },
      error: (error) => console.error('Error loading stats:', error)
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

  calculateTotalReturns(): number {
    return this.userInvestments.reduce((total, investment) =>
      total + (investment.returnsGenerated || 0), 0);
  }

  calculateTotalInvested(): number {
    return this.userInvestments.reduce((total, investment) =>
      total + investment.investedCredits, 0);
  }

  getPerformanceColor(rate: number): string {
    if (rate > 0) return 'text-success';
    if (rate < 0) return 'text-danger';
    return 'text-muted';
  }

  getFundName(fundId: number): string {
    const fund = this.availableFunds.find(f => f.id === fundId);
    return fund ? fund.name : 'Fonds inconnu';
  }

  calculateInvestmentPerformance(investment: any): number {
    if (investment.investedCredits === 0) return 0;
    return ((investment.currentValue - investment.investedCredits) / investment.investedCredits) * 100;
  }

  withdrawInvestment(investmentId: number): void {
    // Implement withdrawal logic
    console.log('Withdraw from investment:', investmentId);
  }
}
