import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { ApplicationService } from '../../../services/application.service';
import { JobOffer, StatutOffre } from '../../../models/job-offer.model';
import { User, Role } from '../../../models/user.model';
import { Application, StatutCandidature } from '../../../models/application.model';

@Component({
  selector: 'app-job-offer-list',
  templateUrl: './job-offer-list.component.html',
  styleUrls: ['./job-offer-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class JobOfferListComponent implements OnInit {
  offers: JobOffer[] = [];
  filteredOffers: JobOffer[] = [];
  loading = false;
  searchTerm = '';
  activeFilter: 'all' | 'active' | 'remote' | 'urgent' = 'all';
  sortBy = 'newest';
  currentUser: User | null = null;

  get isOwner(): boolean {
    // TODO: Implement owner check logic - for now return false
    return false;
  }

  showApplicationModal = false;
  selectedOffer: JobOffer | null = null;
  applicationForm: any;

  constructor(
    private jobOfferService: JobOfferService,
    private userService: UserService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
    this.loadCurrentUser();
  }

  loadOffers(): void {
    this.loading = true;

    // Load static job offers immediately
    const staticOffers: JobOffer[] = [
      {
        idJobOffer: 1,
        title: 'Développeur Full Stack Senior',
        description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies.',
        requirementsHardSkills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'PostgreSQL'],
        requirementsSoftSkills: ['Travail d\'équipe', 'Communication', 'Résolution de problèmes'],
        salaryMin: 45000,
        salaryMax: 65000,
        remote: true,
        publishedAt: new Date('2024-01-15'),
        expiresAt: new Date('2024-03-15'),
        status: StatutOffre.PUBLIQUE,
        workflowStatus: 'PUBLIE',
        user: 1,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        idJobOffer: 2,
        title: 'Data Scientist',
        description: 'Poste passionnant pour un Data Scientist confirmé. Analyse de données massives, création de modèles prédictifs et visualisation de données.',
        requirementsHardSkills: ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau'],
        requirementsSoftSkills: ['Analyse critique', 'Créativité', 'Présentation'],
        salaryMin: 55000,
        salaryMax: 75000,
        remote: false,
        publishedAt: new Date('2024-01-20'),
        expiresAt: new Date('2024-04-20'),
        status: StatutOffre.PUBLIQUE,
        workflowStatus: 'PUBLIE',
        user: 2,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
      },
      {
        idJobOffer: 3,
        title: 'Chef de Projet Digital',
        description: 'Rejoignez notre équipe en tant que Chef de Projet Digital. Vous serez responsable de la gestion de projets web complexes du cahier des charges à la livraison.',
        requirementsHardSkills: ['Gestion de projet', 'Agile/Scrum', 'Outils collaboratifs'],
        requirementsSoftSkills: ['Leadership', 'Organisation', 'Gestion du stress'],
        salaryMin: 40000,
        salaryMax: 55000,
        remote: true,
        publishedAt: new Date('2024-02-01'),
        expiresAt: new Date('2024-05-01'),
        status: StatutOffre.PUBLIQUE,
        workflowStatus: 'PUBLIE',
        user: 3,
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-02-01')
      },
      {
        idJobOffer: 4,
        title: 'Designer UX/UI',
        description: 'Nous cherchons un designer UX/UI créatif pour améliorer l\'expérience utilisateur de nos applications. Travail en collaboration étroite avec les développeurs.',
        requirementsHardSkills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Design systems'],
        requirementsSoftSkills: ['Créativité', 'Empathie utilisateur', 'Attention aux détails'],
        salaryMin: 35000,
        salaryMax: 50000,
        remote: true,
        publishedAt: new Date('2024-02-05'),
        expiresAt: new Date('2024-05-05'),
        status: StatutOffre.PUBLIQUE,
        workflowStatus: 'PUBLIE' as any,
        user: 4,
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-05')
      },
      {
        idJobOffer: 5,
        title: 'DevOps Engineer',
        description: 'Poste stratégique pour un DevOps Engineer expérimenté. Mise en place et maintenance d\'infrastructures cloud, CI/CD, monitoring et sécurité.',
        requirementsHardSkills: ['AWS/Azure', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
        requirementsSoftSkills: ['Autonomie', 'Proactivité', 'Travail sous pression'],
        salaryMin: 50000,
        salaryMax: 70000,
        remote: false,
        publishedAt: new Date('2024-02-10'),
        expiresAt: new Date('2024-05-10'),
        status: StatutOffre.PUBLIQUE,
        workflowStatus: 'PUBLIE' as any,
        user: 5,
        createdAt: new Date('2024-02-08'),
        updatedAt: new Date('2024-02-10')
      }
    ];

    this.offers = staticOffers;
    this.applyFilters();
    this.loading = false;

    // Optional: Still try to load from API in background for future data
    this.jobOfferService.getAllJobOffers().subscribe({
      next: (offers) => {
        // Merge with static offers if API returns data
        if (offers && offers.length > 0) {
          this.offers = [...staticOffers, ...offers];
          this.applyFilters();
        }
      },
      error: (error) => {
        // Keep static offers if API fails - no error logging needed
        console.log('Using static job offers (API not available)');
      }
    });
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    // For now, assume user is logged in with sample data
    this.currentUser = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phoneNumber: '+33123456789',
      dateOfBirth: new Date('1990-01-01'),
      createdAt: new Date(),
      isMentor: false,
      banned: false,
      isModerator: false,
      role: Role.CANDIDATE
    } as User;
  }

  filterOffers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOffers = [...this.offers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOffers = this.offers.filter(offer =>
        offer.title.toLowerCase().includes(term) ||
        offer.description?.toLowerCase().includes(term) ||
        offer.requirementsHardSkills?.some(skill => skill.toLowerCase().includes(term)) ||
        offer.requirementsSoftSkills?.some(skill => skill.toLowerCase().includes(term))
      );
    }
    this.applyActiveFilter();
  }

  setFilter(filter: 'all' | 'active' | 'remote' | 'urgent'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  sortOffers(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterOffers();
  }

  private applyFilters(): void {
    this.filterOffers();
  }

  private applyActiveFilter(): void {
    switch (this.activeFilter) {
      case 'active':
        this.filteredOffers = this.filteredOffers.filter(offer =>
          offer.status === 'PUBLIQUE' && (!offer.expiresAt || new Date(offer.expiresAt) > new Date())
        );
        break;
      case 'remote':
        this.filteredOffers = this.filteredOffers.filter(offer => offer.remote);
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }
  }

  getActiveOffersCount(): number {
    return this.offers.filter(offer =>
      offer.status === 'PUBLIQUE' && (!offer.expiresAt || new Date(offer.expiresAt) > new Date())
    ).length;
  }

  getRemoteOffersCount(): number {
    return this.offers.filter(offer => offer.remote).length;
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
    console.log('canApply check:', {
      currentUser: !!this.currentUser,
      status: offer.status,
      expiresAt: offer.expiresAt,
      isExpired: offer.expiresAt ? new Date(offer.expiresAt) < new Date() : false
    });
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

    this.selectedOffer = offer;
    this.showApplicationModal = true;
    this.initializeApplicationForm();
  }

  initializeApplicationForm(): void {
    // TODO: Initialize form with user data and offer requirements
    this.applicationForm = {
      motivationLetter: '',
      coverLetter: '',
      // Add other application fields as needed
    };
  }

  submitApplication(): void {
    if (!this.selectedOffer || !this.currentUser || !this.applicationForm) {
      return;
    }

    const application: Partial<Application> = {
      motivationLetter: this.applicationForm.motivationLetter,
      coverLetter: this.applicationForm.coverLetter,
      status: StatutCandidature.EN_ATTENTE,
      jobOffer: this.selectedOffer.idJobOffer,
      user: this.currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.applicationService.createApplication(this.selectedOffer.idJobOffer, application).subscribe({
      next: (createdApplication) => {
        console.log('Application submitted successfully:', createdApplication);
        this.closeApplicationModal();
        // TODO: Show success message
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        // TODO: Show error message
      }
    });
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
    this.selectedOffer = null;
    this.applicationForm = null;
  }

  trackByOfferId(index: number, offer: JobOffer): number {
    return offer.idJobOffer;
  }

  isUrgent(offer: JobOffer): boolean {
    // Consider offers expiring within 7 days as urgent
    if (!offer.expiresAt) return false;
    const daysUntilExpiry = Math.ceil((new Date(offer.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }

  isExpiringSoon(offer: JobOffer): boolean {
    return this.isUrgent(offer);
  }

  getRandomViews(): number {
    return Math.floor(Math.random() * 500) + 50;
  }

  getRandomApplications(): number {
    return Math.floor(Math.random() * 50) + 5;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.sortBy = 'newest';
    this.filterOffers();
  }
}