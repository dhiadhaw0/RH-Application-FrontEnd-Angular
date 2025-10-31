import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer, StatutOffre } from '../../../models/job-offer.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-job-offer-search',
  templateUrl: './job-offer-search.component.html',
  styleUrls: ['./job-offer-search.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule]
})
export class JobOfferSearchComponent implements OnInit {
  searchResults: JobOffer[] = [];
  loading = false;
  currentUser: User | null = null;

  // Search filters
  searchQuery = '';
  selectedStatus: StatutOffre | '' = '';
  remoteOnly = false;
  salaryMin: number | null = null;
  salaryMax: number | null = null;
  publishedAfter: string = '';
  publishedBefore: string = '';

  // Available options
  statusOptions: { value: StatutOffre; label: string }[] = [
    { value: StatutOffre.PUBLIQUE, label: 'Publiques' },
    { value: StatutOffre.BROUILLON, label: 'Brouillons' },
    { value: StatutOffre.EN_VALIDATION, label: 'En validation' },
    { value: StatutOffre.EXPIREE, label: 'Expirées' },
    { value: StatutOffre.ARCHIVEE, label: 'Archivées' }
  ];

  constructor(
    private jobOfferService: JobOfferService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    this.currentUser = null;
  }

  performSearch(): void {
    if (!this.hasActiveFilters()) {
      this.searchResults = [];
      return;
    }

    this.loading = true;

    // Determine which search method to use based on filters
    if (this.searchQuery.trim()) {
      this.searchByTitle();
    } else if (this.selectedStatus) {
      this.searchByStatus();
    } else if (this.remoteOnly) {
      this.searchByRemote();
    } else if (this.salaryMin || this.salaryMax) {
      this.searchBySalary();
    } else if (this.publishedAfter || this.publishedBefore) {
      this.searchByDate();
    } else {
      // Fallback to get all offers
      this.loadAllOffers();
    }
  }

  private searchByTitle(): void {
    this.jobOfferService.findByTitle(this.searchQuery.trim()).subscribe({
      next: (results) => {
        this.searchResults = this.applyAdditionalFilters(results);
      },
      error: (error) => {
        console.error('Error searching by title:', error);
        this.searchResults = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private searchByStatus(): void {
    this.jobOfferService.findByStatus(this.selectedStatus as StatutOffre).subscribe({
      next: (results) => {
        this.searchResults = this.applyAdditionalFilters(results);
      },
      error: (error) => {
        console.error('Error searching by status:', error);
        this.searchResults = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private searchByRemote(): void {
    this.jobOfferService.findByRemote(true).subscribe({
      next: (results) => {
        this.searchResults = this.applyAdditionalFilters(results);
      },
      error: (error) => {
        console.error('Error searching by remote:', error);
        this.searchResults = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private searchBySalary(): void {
    const minSalary = this.salaryMin || 0;
    const maxSalary = this.salaryMax || Number.MAX_SAFE_INTEGER;

    this.jobOfferService.findBySalaryRange(minSalary, maxSalary).subscribe({
      next: (results) => {
        this.searchResults = this.applyAdditionalFilters(results);
      },
      error: (error) => {
        console.error('Error searching by salary:', error);
        this.searchResults = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private searchByDate(): void {
    const startDate = this.publishedAfter || '1970-01-01';
    const endDate = this.publishedBefore || new Date().toISOString().split('T')[0];

    this.jobOfferService.findByPublishedDateBetween(startDate, endDate).subscribe({
      next: (results) => {
        this.searchResults = this.applyAdditionalFilters(results);
      },
      error: (error) => {
        console.error('Error searching by date:', error);
        this.searchResults = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private loadAllOffers(): void {
    this.jobOfferService.getAllJobOffers().subscribe({
      next: (results) => {
        this.searchResults = this.applyAdditionalFilters(results);
      },
      error: (error) => {
        console.error('Error loading all offers:', error);
        this.searchResults = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private applyAdditionalFilters(offers: JobOffer[]): JobOffer[] {
    let filtered = [...offers];

    // Apply remote filter if not already applied
    if (this.remoteOnly && !this.isRemoteSearch()) {
      filtered = filtered.filter(offer => offer.remote);
    }

    // Apply salary filter if not already applied
    if ((this.salaryMin || this.salaryMax) && !this.isSalarySearch()) {
      filtered = filtered.filter(offer => {
        if (!offer.salaryMin && !offer.salaryMax) return true;
        const min = this.salaryMin || 0;
        const max = this.salaryMax || Number.MAX_SAFE_INTEGER;
        const offerMin = offer.salaryMin || 0;
        const offerMax = offer.salaryMax || Number.MAX_SAFE_INTEGER;
        return offerMin <= max && offerMax >= min;
      });
    }

    // Apply date filter if not already applied
    if ((this.publishedAfter || this.publishedBefore) && !this.isDateSearch()) {
      filtered = filtered.filter(offer => {
        if (!offer.publishedAt) return true;
        const offerDate = new Date(offer.publishedAt).toISOString().split('T')[0];
        const startDate = this.publishedAfter || '1970-01-01';
        const endDate = this.publishedBefore || '9999-12-31';
        return offerDate >= startDate && offerDate <= endDate;
      });
    }

    return filtered;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchQuery.trim() ||
      this.selectedStatus ||
      this.remoteOnly ||
      this.salaryMin ||
      this.salaryMax ||
      this.publishedAfter ||
      this.publishedBefore
    );
  }

  private isRemoteSearch(): boolean {
    return this.remoteOnly && !this.searchQuery.trim() && !this.selectedStatus && !this.salaryMin && !this.salaryMax && !this.publishedAfter && !this.publishedBefore;
  }

  private isSalarySearch(): boolean {
    return (this.salaryMin || this.salaryMax) && !this.searchQuery.trim() && !this.selectedStatus && !this.remoteOnly && !this.publishedAfter && !this.publishedBefore;
  }

  private isDateSearch(): boolean {
    return (this.publishedAfter || this.publishedBefore) && !this.searchQuery.trim() && !this.selectedStatus && !this.remoteOnly && !this.salaryMin && !this.salaryMax;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.remoteOnly = false;
    this.salaryMin = null;
    this.salaryMax = null;
    this.publishedAfter = '';
    this.publishedBefore = '';
    this.searchResults = [];
  }

  toggleFavorite(offer: JobOffer): void {
    // TODO: Implement favorite toggle logic
    console.log('Toggle favorite for offer:', offer.idJobOffer);
  }

  isFavorite(offer: JobOffer): boolean {
    // TODO: Implement favorite check logic
    return false;
  }

  canApply(offer: JobOffer): boolean {
    if (!this.currentUser) return false;
    if (offer.status !== 'PUBLIQUE') return false;
    if (offer.expiresAt && new Date(offer.expiresAt) < new Date()) return false;
    return true;
  }

  applyToOffer(offer: JobOffer): void {
    if (!this.currentUser) {
      console.error('User not logged in');
      return;
    }

    // TODO: Navigate to application creation page with pre-filled data
    console.log('Apply to offer:', offer.idJobOffer, 'for user:', this.currentUser.id);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'BROUILLON': '#6b7280',
      'EN_VALIDATION': '#fbbf24',
      'PUBLIQUE': '#10b981',
      'EXPIREE': '#ef4444',
      'ARCHIVEE': '#374151'
    };
    return colors[status] || '#6b7280';
  }

  getWorkflowStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'REDACTION': '#6b7280',
      'EN_ATTENTE_VALIDATION': '#fbbf24',
      'PUBLIE': '#10b981',
      'ARCHIVE': '#374151',
      'REFUSE': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }
}