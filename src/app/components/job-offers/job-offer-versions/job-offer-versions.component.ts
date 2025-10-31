import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer } from '../../../models/job-offer.model';
import { JobOfferVersion } from '../../../models/job-offer-version.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-job-offer-versions',
  templateUrl: './job-offer-versions.component.html',
  styleUrls: ['./job-offer-versions.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class JobOfferVersionsComponent implements OnInit {
  offer: JobOffer | null = null;
  versions: JobOfferVersion[] = [];
  loading = false;
  currentUser: User | null = null;
  isOwner = false;
  selectedVersion: JobOfferVersion | null = null;
  showVersionDetails = false;

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
      this.loadVersions(+id);
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

  loadVersions(id: number): void {
    this.jobOfferService.getAllVersions(id).subscribe({
      next: (versions) => {
        this.versions = versions.sort((a, b) =>
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading versions:', error);
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

  selectVersion(version: JobOfferVersion): void {
    this.selectedVersion = version;
    this.showVersionDetails = true;
  }

  closeVersionDetails(): void {
    this.selectedVersion = null;
    this.showVersionDetails = false;
  }

  restoreVersion(version: JobOfferVersion): void {
    if (!this.offer || !confirm('Êtes-vous sûr de vouloir restaurer cette version ?')) return;

    this.jobOfferService.restoreVersion(this.offer.idJobOffer, version.id).subscribe({
      next: (updatedOffer) => {
        this.offer = updatedOffer;
        this.loadVersions(updatedOffer.idJobOffer);
        alert('Version restaurée avec succès');
      },
      error: (error) => {
        console.error('Error restoring version:', error);
        alert('Erreur lors de la restauration de la version');
      }
    });
  }

  createVersion(draft: boolean = false): void {
    if (!this.offer) return;

    this.jobOfferService.saveDraftOrVersion(this.offer.idJobOffer, draft).subscribe({
      next: (version) => {
        this.loadVersions(this.offer!.idJobOffer);
        alert(draft ? 'Brouillon sauvegardé' : 'Version créée');
      },
      error: (error) => {
        console.error('Error creating version:', error);
        alert('Erreur lors de la création de la version');
      }
    });
  }

  compareVersions(version1: JobOfferVersion, version2: JobOfferVersion): void {
    // TODO: Implement version comparison
    console.log('Compare versions:', version1.id, 'vs', version2.id);
  }

  getVersionChanges(version: JobOfferVersion): string[] {
    // TODO: Implement change detection logic
    // This would compare the version with the current offer
    return [
      'Titre modifié',
      'Description mise à jour',
      'Salaire ajusté',
      'Compétences ajoutées'
    ];
  }

  formatVersionDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getVersionTypeLabel(version: JobOfferVersion): string {
    if (version.draft) return 'Brouillon';
    // TODO: Add logic to determine if published
    return 'Version sauvegardée';
  }

  getVersionTypeColor(version: JobOfferVersion): string {
    if (version.draft) return '#6b7280';
    // TODO: Add logic to determine if published
    return '#3b82f6';
  }

  isCurrentVersion(version: JobOfferVersion): boolean {
    // TODO: Implement logic to check if this is the current version
    return false;
  }

  goBack(): void {
    if (this.offer) {
      this.router.navigate(['/job-offers', this.offer.idJobOffer]);
    } else {
      this.router.navigate(['/job-offers']);
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