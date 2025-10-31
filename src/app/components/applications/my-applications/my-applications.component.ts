import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ApplicationService } from '../../../services/application.service';
import { Application, StatutCandidature } from '../../../models/application.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule, NavbarComponent]
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading = false;

  searchTerm = '';
  activeFilter: string = 'all';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadUserApplications();
  }

  loadUserApplications(): void {
    this.loading = true;
    // TODO: Get current user ID from auth service
    const currentUserId = 1; // Mock user ID

    this.applicationService.getApplicationsByUser(currentUserId).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filterApplications();
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filterApplications(): void {
    let filtered = this.applications;

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        // TODO: Add job offer title and company search when available
        app.motivationLetter?.toLowerCase().includes(searchLower) ||
        app.coverLetter?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    switch (this.activeFilter) {
      case 'pending':
        filtered = filtered.filter(app => app.status === StatutCandidature.EN_ATTENTE);
        break;
      case 'interview':
        filtered = filtered.filter(app =>
          app.status === StatutCandidature.ENTRETIEN_PLANIFIE ||
          app.status === StatutCandidature.ENTRETIEN_EFFECTUE
        );
        break;
      case 'accepted':
        filtered = filtered.filter(app => app.status === StatutCandidature.ACCEPTEE);
        break;
      case 'rejected':
        filtered = filtered.filter(app => app.status === StatutCandidature.REFUSEE);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    this.filteredApplications = filtered;
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterApplications();
  }

  getTotalApplications(): number {
    return this.applications.length;
  }

  getPendingApplications(): number {
    return this.applications.filter(app => app.status === StatutCandidature.EN_ATTENTE).length;
  }

  getAcceptedApplications(): number {
    return this.applications.filter(app => app.status === StatutCandidature.ACCEPTEE).length;
  }

  getInterviewApplications(): number {
    return this.applications.filter(app =>
      app.status === StatutCandidature.ENTRETIEN_PLANIFIE ||
      app.status === StatutCandidature.ENTRETIEN_EFFECTUE
    ).length;
  }

  getJobOfferTitle(application: Application): string {
    // TODO: Get job offer title from related job offer
    return `Offre #${application.jobOffer}`;
  }

  getJobOfferCompany(application: Application): string {
    // TODO: Get company name from job offer
    return 'Entreprise';
  }

  getJobOfferLocation(application: Application): string | null {
    // TODO: Get location from job offer
    return null;
  }

  getApplicationProgress(application: Application): number {
    // Calculate progress based on application status
    switch (application.status) {
      case StatutCandidature.EN_ATTENTE:
        return 25;
      case StatutCandidature.EN_COURS_DE_TRAITEMENT:
        return 50;
      case StatutCandidature.ENTRETIEN_PLANIFIE:
        return 75;
      case StatutCandidature.ENTRETIEN_EFFECTUE:
        return 85;
      case StatutCandidature.OFFRE_PROPOSEE:
        return 95;
      case StatutCandidature.ACCEPTEE:
      case StatutCandidature.OFFRE_ACCEPTEE:
        return 100;
      default:
        return 0;
    }
  }

  getNextSteps(application: Application): any[] {
    const steps = [];

    switch (application.status) {
      case StatutCandidature.EN_ATTENTE:
        steps.push({ title: 'Révision de votre candidature', completed: false });
        steps.push({ title: 'Entretien potentiel', completed: false });
        break;
      case StatutCandidature.EN_COURS_DE_TRAITEMENT:
        steps.push({ title: 'Révision de votre candidature', completed: true });
        steps.push({ title: 'Entretien potentiel', completed: false });
        break;
      case StatutCandidature.ENTRETIEN_PLANIFIE:
        steps.push({ title: 'Révision de votre candidature', completed: true });
        steps.push({ title: 'Préparation entretien', completed: false });
        steps.push({ title: 'Passage entretien', completed: false });
        break;
      case StatutCandidature.ENTRETIEN_EFFECTUE:
        steps.push({ title: 'Révision de votre candidature', completed: true });
        steps.push({ title: 'Entretien passé', completed: true });
        steps.push({ title: 'Décision finale', completed: false });
        break;
      case StatutCandidature.OFFRE_PROPOSEE:
        steps.push({ title: 'Révision de votre candidature', completed: true });
        steps.push({ title: 'Entretien passé', completed: true });
        steps.push({ title: 'Réponse à l\'offre', completed: false });
        break;
    }

    return steps;
  }

  canWithdraw(application: Application): boolean {
    // Can withdraw if application is still pending or in treatment
    return application.status === StatutCandidature.EN_ATTENTE ||
           application.status === StatutCandidature.EN_COURS_DE_TRAITEMENT;
  }

  withdrawApplication(application: Application): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cette candidature ? Cette action est irréversible.')) {
      this.applicationService.deleteApplication(application.idApplication).subscribe({
        next: () => {
          this.loadUserApplications(); // Refresh the list
        },
        error: (error) => {
          console.error('Error withdrawing application:', error);
        }
      });
    }
  }

  downloadApplicationReport(application: Application): void {
    this.applicationService.generateReport(application.idApplication).subscribe({
      next: (report) => {
        // TODO: Handle report download
        console.log('Report generated for application:', application.idApplication);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }
}