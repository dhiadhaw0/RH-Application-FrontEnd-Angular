import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrowdfundingService } from '../../../services/crowdfunding.service';
import { FundingCampaign, CampaignStatus, CampaignCategory } from '../../../models/funding-campaign.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-crowdfunding-list',
  standalone: false,
  templateUrl: './crowdfunding-list.component.html',
  styleUrl: './crowdfunding-list.component.scss'
})
export class CrowdfundingListComponent implements OnInit {
  campaigns: FundingCampaign[] = [];
  filteredCampaigns: FundingCampaign[] = [];
  loading = false;
  searchQuery = '';
  selectedCategory: CampaignCategory | '' = '';
  selectedStatus: CampaignStatus | '' = '';

  categories = Object.values(CampaignCategory);
  statuses = Object.values(CampaignStatus);

  constructor(
    private crowdfundingService: CrowdfundingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.crowdfundingService.getFundingCampaigns({
      status: this.selectedStatus || undefined,
      category: this.selectedCategory || undefined
    }).subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.campaigns;

    if (this.searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredCampaigns = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.loadCampaigns();
  }

  onStatusChange(): void {
    this.loadCampaigns();
  }

  getProgressPercentage(campaign: FundingCampaign): number {
    return Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);
  }

  getDaysRemaining(campaign: FundingCampaign): number {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isCampaignActive(campaign: FundingCampaign): boolean {
    return campaign.status === CampaignStatus.ACTIVE;
  }

  isCampaignExpired(campaign: FundingCampaign): boolean {
    return new Date(campaign.endDate) < new Date();
  }

  viewCampaign(campaignId: number): void {
    this.router.navigate(['/crowdfunding', campaignId]);
  }

  createCampaign(): void {
    this.router.navigate(['/crowdfunding/create']);
  }

  getCategoryLabel(category: CampaignCategory): string {
    const labels = {
      [CampaignCategory.EDUCATION]: 'Éducation',
      [CampaignCategory.EQUIPMENT]: 'Équipement',
      [CampaignCategory.CERTIFICATIONS]: 'Certifications',
      [CampaignCategory.TRAINING]: 'Formation',
      [CampaignCategory.BUSINESS]: 'Entreprise',
      [CampaignCategory.OTHER]: 'Autre'
    };
    return labels[category] || category;
  }

  getStatusLabel(status: CampaignStatus): string {
    const labels = {
      [CampaignStatus.ACTIVE]: 'Actif',
      [CampaignStatus.FUNDED]: 'Financé',
      [CampaignStatus.EXPIRED]: 'Expiré',
      [CampaignStatus.CANCELLED]: 'Annulé',
      [CampaignStatus.DRAFT]: 'Brouillon',
      [CampaignStatus.REFUNDING]: 'Remboursement',
      [CampaignStatus.REFUNDED]: 'Remboursé'
    };
    return labels[status] || status;
  }
}
