import { Component, OnInit } from '@angular/core';
import { SkillCreditsMarketplaceService } from '../../../services/skill-credits-marketplace.service';
import { SkillCreditService } from '../../../services/skill-credit.service';
import { AuthService } from '../../../services/auth.service';
import { SkillCreditsOffer, SkillCreditsTransaction } from '../../../models/skill-credits-marketplace.model';

@Component({
  selector: 'app-marketplace-offers',
  standalone: false,
  templateUrl: './marketplace-offers.component.html',
  styleUrl: './marketplace-offers.component.scss'
})
export class MarketplaceOffersComponent implements OnInit {
  availableOffers: SkillCreditsOffer[] = [];
  filteredOffers: SkillCreditsOffer[] = [];
  userTransactions: SkillCreditsTransaction[] = [];
  creditBalance: any = {};
  loading = false;

  selectedType: string = 'ALL';
  searchQuery: string = '';
  sortBy: string = 'newest';

  offerTypes = [
    { value: 'ALL', label: 'Tous les Types' },
    { value: 'MENTORSHIP_SESSION', label: 'Session Mentorat' },
    { value: 'FORMATION_ACCESS', label: 'Accès Formation' },
    { value: 'SKILL_SHARING', label: 'Partage Compétences' },
    { value: 'CONSULTATION', label: 'Consultation' },
    { value: 'CUSTOM_SERVICE', label: 'Service Personnalisé' }
  ];

  sortOptions = [
    { value: 'newest', label: 'Plus Récent' },
    { value: 'oldest', label: 'Plus Ancien' },
    { value: 'price_low', label: 'Prix Croissant' },
    { value: 'price_high', label: 'Prix Décroissant' },
    { value: 'rating', label: 'Meilleure Note' }
  ];

  constructor(
    private marketplaceService: SkillCreditsMarketplaceService,
    private skillCreditService: SkillCreditService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
    this.loadUserData();
  }

  loadOffers(): void {
    this.loading = true;
    this.marketplaceService.getAllOffers().subscribe({
      next: (offers) => {
        this.availableOffers = offers.filter(offer => offer.status === 'ACTIVE');
        this.filteredOffers = [...this.availableOffers];
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        this.loading = false;
      }
    });
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    // Load credit balance
    this.skillCreditService.getCreditBalance(userId).subscribe({
      next: (balance) => {
        this.creditBalance = balance;
      },
      error: (error) => console.error('Error loading credit balance:', error)
    });

    // Load user transactions
    this.marketplaceService.getUserTransactions(userId, 0, 10).subscribe({
      next: (transactions) => {
        this.userTransactions = transactions;
      },
      error: (error) => console.error('Error loading transactions:', error)
    });
  }

  applyFilters(): void {
    let filtered = [...this.availableOffers];

    // Filter by type
    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(offer => offer.offerType === this.selectedType);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(query) ||
        offer.description.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price_low':
          return a.creditsRequired - b.creditsRequired;
        case 'price_high':
          return b.creditsRequired - a.creditsRequired;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    this.filteredOffers = filtered;
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  purchaseOffer(offer: SkillCreditsOffer): void {
    if (this.creditBalance.availableCredits < offer.creditsRequired) {
      alert('Crédits insuffisants pour cet achat.');
      return;
    }

    if (confirm(`Confirmer l'achat de "${offer.title}" pour ${offer.creditsRequired} crédits ?`)) {
      const user = this.authService.getCurrentUser();
      const userId = user?.id || 1;

      this.marketplaceService.purchaseOffer({ offerId: offer.id, buyerId: userId }).subscribe({
        next: (transaction) => {
          alert('Achat effectué avec succès !');
          this.loadOffers(); // Refresh offers
          this.loadUserData(); // Refresh balance and transactions
        },
        error: (error) => {
          console.error('Error purchasing offer:', error);
          alert('Erreur lors de l\'achat. Veuillez réessayer.');
        }
      });
    }
  }

  canPurchaseOffer(offer: SkillCreditsOffer): boolean {
    const user = this.authService.getCurrentUser();
    return user?.id !== offer.sellerId && this.creditBalance.availableCredits >= offer.creditsRequired;
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

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
           (hasHalfStar ? '☆' : '') +
           '☆'.repeat(emptyStars);
  }
}
