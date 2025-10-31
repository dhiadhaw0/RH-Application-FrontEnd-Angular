import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer, WorkflowStatus } from '../../../models/job-offer.model';
import { JobOfferStatusHistory } from '../../../models/job-offer-status-history.model';
import { User } from '../../../models/user.model';

interface WorkflowStep {
  status: WorkflowStatus;
  label: string;
  description: string;
  icon: string;
  color: string;
  canAdvance: boolean;
  canRevert: boolean;
  requirements?: string[];
  actions?: string[];
}

@Component({
  selector: 'app-job-offer-workflow',
  templateUrl: './job-offer-workflow.component.html',
  styleUrls: ['./job-offer-workflow.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class JobOfferWorkflowComponent implements OnInit {
  offer: JobOffer | null = null;
  workflowHistory: JobOfferStatusHistory[] = [];
  loading = false;
  currentUser: User | null = null;
  isOwner = false;

  workflowSteps: WorkflowStep[] = [
    {
      status: WorkflowStatus.REDACTION,
      label: 'Rédaction',
      description: 'Création et modification de l\'offre d\'emploi',
      icon: 'fas fa-edit',
      color: '#6b7280',
      canAdvance: true,
      canRevert: false,
      requirements: ['Titre complet', 'Description détaillée', 'Compétences définies'],
      actions: ['Modifier l\'offre', 'Ajouter des compétences', 'Définir le salaire']
    },
    {
      status: WorkflowStatus.EN_ATTENTE_VALIDATION,
      label: 'En attente de validation',
      description: 'L\'offre est soumise pour validation par un administrateur',
      icon: 'fas fa-clock',
      color: '#fbbf24',
      canAdvance: true,
      canRevert: true,
      requirements: ['Offre complète', 'Validation administrative'],
      actions: ['Attendre la validation', 'Contacter l\'administrateur']
    },
    {
      status: WorkflowStatus.PUBLIE,
      label: 'Publiée',
      description: 'L\'offre est visible par tous les candidats',
      icon: 'fas fa-globe',
      color: '#10b981',
      canAdvance: true,
      canRevert: true,
      requirements: ['Validation approuvée', 'Date de publication'],
      actions: ['Consulter les candidatures', 'Modifier si nécessaire']
    },
    {
      status: WorkflowStatus.ARCHIVE,
      label: 'Archivée',
      description: 'L\'offre n\'est plus active mais conservée',
      icon: 'fas fa-archive',
      color: '#374151',
      canAdvance: false,
      canRevert: true,
      requirements: ['Poste pourvu ou expiré'],
      actions: ['Consulter l\'historique', 'Réactiver si nécessaire']
    },
    {
      status: WorkflowStatus.REFUSE,
      label: 'Refusée',
      description: 'L\'offre a été refusée lors de la validation',
      icon: 'fas fa-times-circle',
      color: '#ef4444',
      canAdvance: false,
      canRevert: false,
      requirements: ['Correction des problèmes'],
      actions: ['Corriger l\'offre', 'Re-soumettre pour validation']
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOffer(+id);
      this.loadWorkflowHistory(+id);
    }
    this.loadCurrentUser();
  }

  loadOffer(id: number): void {
    this.loading = true;
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

  loadWorkflowHistory(id: number): void {
    this.jobOfferService.getWorkflowHistory(id).subscribe({
      next: (history) => {
        this.workflowHistory = history.sort((a, b) =>
          new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading workflow history:', error);
      }
    });
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    this.currentUser = null;
    this.checkPermissions();
  }

  checkPermissions(): void {
    if (!this.offer || !this.currentUser) return;
    this.isOwner = this.offer.user === this.currentUser.id || this.offer.user === this.currentUser;
  }

  getCurrentStep(): WorkflowStep | null {
    if (!this.offer) return null;
    return this.workflowSteps.find(step => step.status === this.offer!.workflowStatus) || null;
  }

  getStepIndex(status: WorkflowStatus): number {
    return this.workflowSteps.findIndex(step => step.status === status);
  }

  isStepCompleted(status: WorkflowStatus): boolean {
    if (!this.offer) return false;
    const currentIndex = this.getStepIndex(this.offer.workflowStatus);
    const stepIndex = this.getStepIndex(status);
    return stepIndex < currentIndex;
  }

  isStepCurrent(status: WorkflowStatus): boolean {
    return this.offer?.workflowStatus === status;
  }

  canAdvanceWorkflow(): boolean {
    const currentStep = this.getCurrentStep();
    return currentStep?.canAdvance && this.isOwner;
  }

  canRevertWorkflow(): boolean {
    const currentStep = this.getCurrentStep();
    return currentStep?.canRevert && this.isOwner;
  }

  advanceWorkflow(): void {
    if (!this.canAdvanceWorkflow() || !this.offer) return;

    this.jobOfferService.advanceWorkflowStatus(this.offer.idJobOffer).subscribe({
      next: (updatedOffer) => {
        this.offer = updatedOffer;
        this.loadWorkflowHistory(updatedOffer.idJobOffer);
      },
      error: (error) => {
        console.error('Error advancing workflow:', error);
      }
    });
  }

  revertWorkflow(): void {
    if (!this.canRevertWorkflow() || !this.offer) return;

    if (confirm('Êtes-vous sûr de vouloir revenir à l\'étape précédente ?')) {
      this.jobOfferService.revertWorkflowStatus(this.offer.idJobOffer).subscribe({
        next: (updatedOffer) => {
          this.offer = updatedOffer;
          this.loadWorkflowHistory(updatedOffer.idJobOffer);
        },
        error: (error) => {
          console.error('Error reverting workflow:', error);
        }
      });
    }
  }

  getNextStep(): WorkflowStep | null {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return null;

    const currentIndex = this.getStepIndex(currentStep.status);
    if (currentIndex < this.workflowSteps.length - 1) {
      return this.workflowSteps[currentIndex + 1];
    }
    return null;
  }

  getPreviousStep(): WorkflowStep | null {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return null;

    const currentIndex = this.getStepIndex(currentStep.status);
    if (currentIndex > 0) {
      return this.workflowSteps[currentIndex - 1];
    }
    return null;
  }

  goBack(): void {
    if (this.offer) {
      this.router.navigate(['/job-offers', this.offer.idJobOffer]);
    } else {
      this.router.navigate(['/job-offers']);
    }
  }

  editOffer(): void {
    if (this.offer && this.isOwner && this.offer.workflowStatus === 'REDACTION') {
      this.router.navigate(['/job-offers', this.offer.idJobOffer, 'edit']);
    }
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