import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrowdfundingService } from '../../../services/crowdfunding.service';
import { DigitalWalletService } from '../../../services/digital-wallet.service';
import { AuthService } from '../../../services/auth.service';
import { FundingCampaign, CampaignStatus, ContributionTier } from '../../../models/funding-campaign.model';
import { Contribution, ContributionType } from '../../../models/contribution.model';

@Component({
  selector: 'app-crowdfunding-detail',
  standalone: false,
  templateUrl: './crowdfunding-detail.component.html',
  styleUrl: './crowdfunding-detail.component.scss'
})
export class CrowdfundingDetailComponent implements OnInit {
  campaign: FundingCampaign | null = null;
  loading = false;
  contributing = false;
  currentUser: any;
  selectedTier: ContributionTier | null = null;
  contributionAmount = 0;
  contributionMessage = '';
  anonymousContribution = false;

  campaignStats: any = {};
  recentContributions: Contribution[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crowdfundingService: CrowdfundingService,
    private walletService: DigitalWalletService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const campaignId = this.route.snapshot.params['id'];
    if (campaignId) {
      this.loadCampaign(campaignId);
    }
    this.currentUser = this.authService.getCurrentUser();
  }

  loadCampaign(campaignId: number): void {
    this.loading = true;
    this.crowdfundingService.getFundingCampaignById(campaignId).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        this.loadCampaignStats(campaignId);
        this.loadRecentContributions(campaignId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
        this.loading = false;
      }
    });
  }

  loadCampaignStats(campaignId: number): void {
    this.crowdfundingService.getCampaignStats(campaignId).subscribe({
      next: (stats) => {
        this.campaignStats = stats;
        // Check for milestone achievements when stats are loaded
        this.checkMilestoneAchievements();
      },
      error: (error) => {
        console.error('Error loading campaign stats:', error);
      }
    });
  }

  checkMilestoneAchievements(): void {
    if (this.campaign?.milestones) {
      this.campaign.milestones.forEach(milestone => {
        if (!milestone.achieved && this.campaign!.currentAmount >= milestone.targetAmount) {
          this.crowdfundingService.checkMilestoneAchievement(this.campaign!.id, milestone.id).subscribe({
            next: (result) => {
              if (result.achieved) {
                milestone.achieved = true;
                milestone.achievedAt = result.achievedAt;
                // Show achievement notification
                this.showMilestoneAchievement(milestone);
              }
            },
            error: (error) => {
              console.error('Error checking milestone achievement:', error);
            }
          });
        }
      });
    }
  }

  showMilestoneAchievement(milestone: any): void {
    // Simple alert for now - could be enhanced with toast notifications
    alert(`🎉 Jalon atteint: ${milestone.title}!`);
  }

  loadRecentContributions(campaignId: number): void {
    this.crowdfundingService.getContributions(campaignId).subscribe({
      next: (contributions) => {
        this.recentContributions = contributions.slice(0, 10); // Show last 10 contributions
      },
      error: (error) => {
        console.error('Error loading contributions:', error);
      }
    });
  }

  selectTier(tier: ContributionTier): void {
    this.selectedTier = tier;
    this.contributionAmount = tier.amount;
  }

  customAmountSelected(): void {
    this.selectedTier = null;
  }

  // Success/Failure Logic
  processCampaignSuccess(): void {
    if (!this.campaign || !this.isCampaignOwner()) return;

    if (confirm('Êtes-vous sûr de vouloir marquer cette campagne comme réussie ? Les fonds seront transférés.')) {
      this.crowdfundingService.processSuccessfulCampaign(this.campaign.id).subscribe({
        next: (result) => {
          alert(result.message);
          this.loadCampaign(this.campaign!.id);
        },
        error: (error) => {
          console.error('Error processing successful campaign:', error);
          alert('Erreur lors du traitement de la campagne réussie.');
        }
      });
    }
  }

  processCampaignFailure(): void {
    if (!this.campaign || !this.isCampaignOwner()) return;

    if (confirm('Êtes-vous sûr de vouloir annuler cette campagne ? Tous les contributeurs seront remboursés.')) {
      this.crowdfundingService.processFailedCampaign(this.campaign.id).subscribe({
        next: (result) => {
          alert(`Campagne annulée. ${result.refundedContributions} contributions remboursées pour un total de ${result.totalRefunded}€.`);
          this.loadCampaign(this.campaign!.id);
        },
        error: (error) => {
          console.error('Error processing failed campaign:', error);
          alert('Erreur lors de l\'annulation de la campagne.');
        }
      });
    }
  }

  // Automatic processing for expired campaigns
  processExpiredCampaign(): void {
    if (!this.campaign || !this.isCampaignExpired()) return;

    this.crowdfundingService.processExpiredCampaign(this.campaign.id).subscribe({
      next: (result) => {
        alert(`Campagne expirée traitée. ${result.refundedAmount}€ remboursés aux contributeurs.`);
        this.loadCampaign(this.campaign!.id);
      },
      error: (error) => {
        console.error('Error processing expired campaign:', error);
        alert('Erreur lors du traitement de la campagne expirée.');
      }
    });
  }

  contribute(): void {
    if (!this.campaign || !this.currentUser) return;

    if (this.contributionAmount <= 0) {
      alert('Veuillez saisir un montant valide.');
      return;
    }

    this.contributing = true;

    this.crowdfundingService.contributeToCampaign(
      this.campaign.id,
      this.contributionAmount,
      this.selectedTier?.id,
      this.anonymousContribution,
      this.contributionMessage || undefined
    ).subscribe({
      next: (contribution) => {
        this.contributing = false;
        alert('Contribution effectuée avec succès !');

        // Check if user earned any rewards
        if (this.selectedTier?.rewards && this.selectedTier.rewards.length > 0) {
          this.showRewardNotification(this.selectedTier.rewards);
        }

        this.loadCampaign(this.campaign!.id);
        this.resetContributionForm();
      },
      error: (error) => {
        console.error('Error making contribution:', error);
        this.contributing = false;
        alert('Erreur lors de la contribution. Veuillez réessayer.');
      }
    });
  }

  showRewardNotification(rewards: string[]): void {
    setTimeout(() => {
      alert(`🎁 Récompenses gagnées: ${rewards.join(', ')}`);
    }, 1000);
  }

  resetContributionForm(): void {
    this.selectedTier = null;
    this.contributionAmount = 0;
    this.contributionMessage = '';
    this.anonymousContribution = false;
  }

  getProgressPercentage(): number {
    if (!this.campaign) return 0;
    return Math.min((this.campaign.currentAmount / this.campaign.targetAmount) * 100, 100);
  }

  getDaysRemaining(): number {
    if (!this.campaign) return 0;
    const endDate = new Date(this.campaign.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isCampaignActive(): boolean {
    return this.campaign?.status === CampaignStatus.ACTIVE;
  }

  isCampaignExpired(): boolean {
    if (!this.campaign) return false;
    return new Date(this.campaign.endDate) < new Date();
  }

  isCampaignOwner(): boolean {
    return this.currentUser && this.campaign && this.campaign.userId === this.currentUser.id;
  }

  canContribute(): boolean {
    return this.isCampaignActive() && !this.isCampaignOwner();
  }

  goBack(): void {
    this.router.navigate(['/crowdfunding']);
  }

  editCampaign(): void {
    if (this.campaign) {
      this.router.navigate(['/crowdfunding', this.campaign.id, 'edit']);
    }
  }

  getCategoryLabel(): string {
    if (!this.campaign) return '';
    const labels = {
      'EDUCATION': 'Éducation',
      'EQUIPMENT': 'Équipement',
      'CERTIFICATIONS': 'Certifications',
      'TRAINING': 'Formation',
      'BUSINESS': 'Entreprise',
      'OTHER': 'Autre'
    };
    return labels[this.campaign.category] || this.campaign.category;
  }

  getStatusLabel(): string {
    if (!this.campaign) return '';
    const labels = {
      'ACTIVE': 'Actif',
      'FUNDED': 'Financé',
      'EXPIRED': 'Expiré',
      'CANCELLED': 'Annulé',
      'DRAFT': 'Brouillon',
      'REFUNDING': 'Remboursement',
      'REFUNDED': 'Remboursé'
    };
    return labels[this.campaign.status] || this.campaign.status;
  }
}
