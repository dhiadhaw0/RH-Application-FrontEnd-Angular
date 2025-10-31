import { Component, OnInit } from '@angular/core';
import { SkillCreditsMarketplaceService } from '../../../services/skill-credits-marketplace.service';
import { SkillCreditService } from '../../../services/skill-credit.service';
import { AuthService } from '../../../services/auth.service';
import { SkillCreditsOffer, MarketplaceStats, SkillCreditsTransaction } from '../../../models/skill-credits-marketplace.model';

@Component({
  selector: 'app-marketplace-dashboard',
  standalone: false,
  templateUrl: './marketplace-dashboard.component.html',
  styleUrl: './marketplace-dashboard.component.scss'
})
export class MarketplaceDashboardComponent implements OnInit {
  userOffers: SkillCreditsOffer[] = [];
  recentTransactions: SkillCreditsTransaction[] = [];
  marketplaceStats: MarketplaceStats | null = null;
  userStats: any = {};
  creditBalance: any = {};
  loading = false;

  constructor(
    private marketplaceService: SkillCreditsMarketplaceService,
    private skillCreditService: SkillCreditService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    // Load user offers
    this.marketplaceService.getUserOffers(userId).subscribe({
      next: (offers) => {
        this.userOffers = offers;
      },
      error: (error) => console.error('Error loading user offers:', error)
    });

    // Load recent transactions
    this.marketplaceService.getUserTransactions(userId, 0, 5).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
      },
      error: (error) => console.error('Error loading transactions:', error)
    });

    // Load marketplace stats
    this.marketplaceService.getMarketplaceStats().subscribe({
      next: (stats) => {
        this.marketplaceStats = stats;
      },
      error: (error) => console.error('Error loading marketplace stats:', error)
    });

    // Load user marketplace stats
    this.marketplaceService.getUserMarketplaceStats(userId).subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => console.error('Error loading user stats:', error)
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'PAUSED': return 'bg-warning';
      case 'COMPLETED': return 'bg-info';
      case 'CANCELLED': return 'bg-danger';
      case 'EXPIRED': return 'bg-secondary';
      default: return 'bg-light';
    }
  }

  getTransactionStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'text-success';
      case 'PENDING': return 'text-warning';
      case 'FAILED': return 'text-danger';
      case 'REFUNDED': return 'text-info';
      default: return 'text-muted';
    }
  }

  formatOfferType(type: string): string {
    const typeMap = {
      'MENTORSHIP_SESSION': 'Session Mentorat',
      'FORMATION_ACCESS': 'Accès Formation',
      'SKILL_SHARING': 'Partage Compétences',
      'CONSULTATION': 'Consultation',
      'CUSTOM_SERVICE': 'Service Personnalisé'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  }

  toggleOfferStatus(offer: SkillCreditsOffer): void {
    if (offer.status === 'ACTIVE') {
      this.marketplaceService.pauseOffer(offer.id).subscribe({
        next: (updatedOffer) => {
          offer.status = updatedOffer.status;
        },
        error: (error) => console.error('Error pausing offer:', error)
      });
    } else if (offer.status === 'PAUSED') {
      this.marketplaceService.resumeOffer(offer.id).subscribe({
        next: (updatedOffer) => {
          offer.status = updatedOffer.status;
        },
        error: (error) => console.error('Error resuming offer:', error)
      });
    }
  }
}
