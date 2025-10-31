import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer, StatutOffre, WorkflowStatus } from '../../../models/job-offer.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-my-job-offers',
  templateUrl: './my-job-offers.component.html',
  styleUrls: ['./my-job-offers.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule]
})
export class MyJobOffersComponent implements OnInit {
  offers: JobOffer[] = [];
  filteredOffers: JobOffer[] = [];
  loading = false;
  currentUser: User | null = null;

  // Filter options
  activeFilter: 'all' | 'drafts' | 'published' | 'expired' = 'all';
  sortBy: 'newest' | 'oldest' | 'title' = 'newest';

  // Statistics
  stats = {
    total: 0,
    drafts: 0,
    published: 0,
    expired: 0,
    inValidation: 0
  };

  constructor(
    private jobOfferService: JobOfferService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUserOffers();
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    this.currentUser = null; // Will be set by auth service
  }

  loadUserOffers(): void {
    if (!this.currentUser?.id) return;

    this.loading = true;
    this.jobOfferService.findByUserId(this.currentUser.id).subscribe({
      next: (offers) => {
        this.offers = offers;
        this.calculateStats();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading user job offers:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats = {
      total: this.offers.length,
      drafts: this.offers.filter(o => o.status === StatutOffre.BROUILLON).length,
      published: this.offers.filter(o => o.status === StatutOffre.PUBLIQUE).length,
      expired: this.offers.filter(o => o.status === StatutOffre.EXPIREE).length,
      inValidation: this.offers.filter(o => o.workflowStatus === WorkflowStatus.EN_ATTENTE_VALIDATION).length
    };
  }

  setFilter(filter: 'all' | 'drafts' | 'published' | 'expired'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  setSort(sort: 'newest' | 'oldest' | 'title'): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.offers];

    // Apply status filter
    switch (this.activeFilter) {
      case 'drafts':
        filtered = filtered.filter(offer => offer.status === StatutOffre.BROUILLON);
        break;
      case 'published':
        filtered = filtered.filter(offer => offer.status === StatutOffre.PUBLIQUE);
        break;
      case 'expired':
        filtered = filtered.filter(offer => offer.status === StatutOffre.EXPIREE);
        break;
      case 'all':
      default:
        // No status filtering
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'oldest':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    this.filteredOffers = filtered;
  }

  editOffer(offer: JobOffer): void {
    // Navigate to edit page
    console.log('Edit offer:', offer.idJobOffer);
  }

  deleteOffer(offer: JobOffer): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${offer.title}" ?`)) {
      this.jobOfferService.deleteJobOffer(offer.idJobOffer).subscribe({
        next: () => {
          this.offers = this.offers.filter(o => o.idJobOffer !== offer.idJobOffer);
          this.calculateStats();
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting job offer:', error);
        }
      });
    }
  }

  duplicateOffer(offer: JobOffer): void {
    // TODO: Implement offer duplication
    console.log('Duplicate offer:', offer.idJobOffer);
  }

  advanceWorkflow(offer: JobOffer): void {
    this.jobOfferService.advanceWorkflowStatus(offer.idJobOffer).subscribe({
      next: (updatedOffer) => {
        const index = this.offers.findIndex(o => o.idJobOffer === updatedOffer.idJobOffer);
        if (index !== -1) {
          this.offers[index] = updatedOffer;
          this.calculateStats();
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error advancing workflow:', error);
      }
    });
  }

  revertWorkflow(offer: JobOffer): void {
    this.jobOfferService.revertWorkflowStatus(offer.idJobOffer).subscribe({
      next: (updatedOffer) => {
        const index = this.offers.findIndex(o => o.idJobOffer === updatedOffer.idJobOffer);
        if (index !== -1) {
          this.offers[index] = updatedOffer;
          this.calculateStats();
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error reverting workflow:', error);
      }
    });
  }

  canAdvanceWorkflow(offer: JobOffer): boolean {
    // Logic to determine if workflow can be advanced
    return offer.workflowStatus !== WorkflowStatus.REFUSE;
  }

  canRevertWorkflow(offer: JobOffer): boolean {
    // Logic to determine if workflow can be reverted
    return offer.workflowStatus !== WorkflowStatus.REDACTION;
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

  getWorkflowStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'REDACTION': 'Rédaction',
      'EN_ATTENTE_VALIDATION': 'En attente de validation',
      'PUBLIE': 'Publié',
      'ARCHIVE': 'Archivé',
      'REFUSE': 'Refusé'
    };
    return texts[status] || status;
  }

  getNextWorkflowStatus(currentStatus: string): string {
    const workflow: { [key: string]: string } = {
      'REDACTION': 'EN_ATTENTE_VALIDATION',
      'EN_ATTENTE_VALIDATION': 'PUBLIE',
      'PUBLIE': 'ARCHIVE'
    };
    return workflow[currentStatus] || currentStatus;
  }

  getPreviousWorkflowStatus(currentStatus: string): string {
    const workflow: { [key: string]: string } = {
      'EN_ATTENTE_VALIDATION': 'REDACTION',
      'PUBLIE': 'EN_ATTENTE_VALIDATION',
      'ARCHIVE': 'PUBLIE'
    };
    return workflow[currentStatus] || currentStatus;
  }
}