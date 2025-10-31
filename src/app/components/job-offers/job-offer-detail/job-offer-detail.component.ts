import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { ApplicationService } from '../../../services/application.service';
import { CompanyProfileService } from '../../../services/company-profile.service';
import { JobOffer } from '../../../models/job-offer.model';
import { User, Role } from '../../../models/user.model';
import { Application, StatutCandidature } from '../../../models/application.model';
import { CompanyProfile } from '../../../models/company-profile.model';
import { BenefitsCalculatorComponent } from '../../company-profiles/benefits-calculator/benefits-calculator.component';

@Component({
  selector: 'app-job-offer-detail',
  templateUrl: './job-offer-detail.component.html',
  styleUrls: ['./job-offer-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule]
})
export class JobOfferDetailComponent implements OnInit {
  offer: JobOffer | null = null;
  loading = false;
  currentUser: User | null = null;
  isOwner = false;
  canEdit = false;
  canApply = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private userService: UserService,
    private applicationService: ApplicationService,
    private companyProfileService: CompanyProfileService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOffer(+id);
    }
    this.loadCurrentUser();
  }

  loadOffer(id: number): void {
    this.loading = true;

    // First try to get from static data
    const staticOffers = this.getStaticJobOffers();
    const staticOffer = staticOffers.find(offer => offer.idJobOffer === id);

    if (staticOffer) {
      this.offer = staticOffer;
      this.checkPermissions();
      this.loading = false;
      return;
    }

    // Fallback to API call
    this.jobOfferService.getJobOfferById(id).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.checkPermissions();
      },
      error: (error) => {
        console.error('Error loading job offer:', error);
        this.router.navigate(['/job-offers']);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private getStaticJobOffers(): JobOffer[] {
    return [
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
        status: 'PUBLIQUE' as any,
        workflowStatus: 'PUBLIE' as any,
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
        status: 'PUBLIQUE' as any,
        workflowStatus: 'PUBLIE' as any,
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
        status: 'PUBLIQUE' as any,
        workflowStatus: 'PUBLIE' as any,
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
        status: 'PUBLIQUE' as any,
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
        status: 'PUBLIQUE' as any,
        workflowStatus: 'PUBLIE' as any,
        user: 5,
        createdAt: new Date('2024-02-08'),
        updatedAt: new Date('2024-02-10')
      }
    ];
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
    this.checkPermissions();
  }

  checkPermissions(): void {
    if (!this.offer || !this.currentUser) return;

    this.isOwner = this.offer.user === this.currentUser.id || this.offer.user === this.currentUser;
    this.canEdit = this.isOwner && this.offer.workflowStatus === 'REDACTION';
    this.canApply = !this.isOwner &&
                   this.offer.status === 'PUBLIQUE' &&
                   (!this.offer.expiresAt || new Date(this.offer.expiresAt) > new Date());
  }

  editOffer(): void {
    if (this.canEdit && this.offer) {
      this.router.navigate(['/job-offers', this.offer.idJobOffer, 'edit']);
    }
  }

  deleteOffer(): void {
    if (this.canEdit && this.offer && confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.jobOfferService.deleteJobOffer(this.offer.idJobOffer).subscribe({
        next: () => {
          this.router.navigate(['/job-offers']);
        },
        error: (error) => {
          console.error('Error deleting job offer:', error);
        }
      });
    }
  }

  showApplicationModal = false;
  applicationData = {
    motivationLetter: '',
    coverLetter: ''
  };

  applyToOffer(): void {
    if (this.canApply && this.currentUser && this.offer) {
      this.showApplicationModal = true;
    }
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
  }

  submitApplication(applicationData: any): void {
    if (!this.offer || !this.currentUser) return;

    const application: Partial<Application> = {
      motivationLetter: applicationData.motivationLetter,
      coverLetter: applicationData.coverLetter,
      status: StatutCandidature.EN_ATTENTE,
      jobOffer: this.offer.idJobOffer,
      user: this.currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.applicationService.createApplication(this.offer.idJobOffer, application).subscribe({
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

  toggleFavorite(): void {
    if (this.offer) {
      // TODO: Implement favorite toggle logic
      console.log('Toggle favorite for offer:', this.offer.idJobOffer);
    }
  }

  isFavorite(): boolean {
    // TODO: Implement favorite check logic
    return false;
  }

  goBack(): void {
    this.router.navigate(['/job-offers']);
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

  isExpired(date: string | Date): boolean {
    return new Date(date) < new Date();
  }

  toggleFollowCompany(company: CompanyProfile): void {
    this.companyProfileService.followCompany(company.id).subscribe({
      next: () => {
        company.isFollowing = true;
        company.followersCount++;
      },
      error: (error) => {
        console.error('Error following company:', error);
      }
    });
  }

  isFollowingCompany(company: CompanyProfile): boolean {
    return company.isFollowing || false;
  }

  getAverageRating(company: CompanyProfile): number {
    if (!company.testimonials || company.testimonials.length === 0) return 0;
    const sum = company.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / company.testimonials.length) * 10) / 10;
  }
}