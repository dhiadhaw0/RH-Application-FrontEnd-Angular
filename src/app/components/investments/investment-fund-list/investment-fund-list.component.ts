import { Component, OnInit } from '@angular/core';
import { SkillInvestmentService } from '../../../services/skill-investment.service';
import { SkillInvestmentFund, InvestmentFundType } from '../../../models/skill-investment.model';

@Component({
  selector: 'app-investment-fund-list',
  standalone: false,
  templateUrl: './investment-fund-list.component.html',
  styleUrl: './investment-fund-list.component.scss'
})
export class InvestmentFundListComponent implements OnInit {
  funds: SkillInvestmentFund[] = [];
  filteredFunds: SkillInvestmentFund[] = [];
  selectedType: string = 'ALL';
  loading = false;

  fundTypes = [
    { value: 'ALL', label: 'Tous les Fonds' },
    { value: 'FORMATION_PERFORMANCE', label: 'Performance Formation' },
    { value: 'CAREER_PROGRESSION', label: 'Progression Carrière' },
    { value: 'MENTORSHIP_SUCCESS', label: 'Succès Mentorat' },
    { value: 'GENERAL_SKILLS', label: 'Compétences Générales' }
  ];

  constructor(private investmentService: SkillInvestmentService) {}

  ngOnInit(): void {
    this.loadFunds();
  }

  loadFunds(): void {
    this.loading = true;
    this.investmentService.getAllFunds().subscribe({
      next: (funds) => {
        this.funds = funds;
        this.filteredFunds = funds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading funds:', error);
        this.loading = false;
      }
    });
  }

  filterFunds(): void {
    if (this.selectedType === 'ALL') {
      this.filteredFunds = this.funds;
    } else {
      this.filteredFunds = this.funds.filter(fund => fund.type === this.selectedType);
    }
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

  getPerformanceColor(rate: number): string {
    if (rate > 0) return 'text-success';
    if (rate < 0) return 'text-danger';
    return 'text-muted';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'CLOSED': return 'bg-warning';
      case 'LIQUIDATED': return 'bg-secondary';
      default: return 'bg-light';
    }
  }
}
