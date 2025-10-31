import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../../services/insurance.service';
import { AuthService } from '../../../services/auth.service';
import { EmploymentInsurance, InsuranceStatus } from '../../../models/insurance.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-insurance-dashboard',
  standalone: false,
  templateUrl: './insurance-dashboard.component.html',
  styleUrl: './insurance-dashboard.component.scss'
})
export class InsuranceDashboardComponent implements OnInit {
  userInsurances: EmploymentInsurance[] = [];
  currentUser: User | null = null;
  loading = false;
  insuranceStats: any = {};

  constructor(
    private insuranceService: InsuranceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUserInsurances();
    this.loadInsuranceStats();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadUserInsurances(): void {
    if (!this.currentUser?.id) return;

    this.loading = true;
    this.insuranceService.getUserInsurances(this.currentUser.id).subscribe({
      next: (insurances) => {
        this.userInsurances = insurances;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading insurances:', error);
        this.loading = false;
      }
    });
  }

  loadInsuranceStats(): void {
    this.insuranceService.getInsuranceStats().subscribe({
      next: (stats) => {
        this.insuranceStats = stats;
      },
      error: (error) => {
        console.error('Error loading insurance stats:', error);
      }
    });
  }

  claimInsurance(insuranceId: number): void {
    if (confirm('Êtes-vous sûr de vouloir faire une réclamation ? Cette action est irréversible.')) {
      this.insuranceService.claimInsurance(insuranceId).subscribe({
        next: (updatedInsurance) => {
          this.loadUserInsurances(); // Reload the list
          alert('Réclamation soumise avec succès !');
        },
        error: (error) => {
          console.error('Error claiming insurance:', error);
          alert('Erreur lors de la réclamation. Veuillez réessayer.');
        }
      });
    }
  }

  getStatusLabel(status: InsuranceStatus): string {
    switch (status) {
      case InsuranceStatus.ACTIVE:
        return 'Actif';
      case InsuranceStatus.CLAIMED:
        return 'Réclamé';
      case InsuranceStatus.EXPIRED:
        return 'Expiré';
      case InsuranceStatus.CANCELLED:
        return 'Annulé';
      default:
        return status;
    }
  }

  getStatusClass(status: InsuranceStatus): string {
    switch (status) {
      case InsuranceStatus.ACTIVE:
        return 'badge-success';
      case InsuranceStatus.CLAIMED:
        return 'badge-info';
      case InsuranceStatus.EXPIRED:
        return 'badge-warning';
      case InsuranceStatus.CANCELLED:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  canClaimInsurance(insurance: EmploymentInsurance): boolean {
    return insurance.status === InsuranceStatus.ACTIVE &&
           new Date(insurance.endDate) < new Date();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }
}
