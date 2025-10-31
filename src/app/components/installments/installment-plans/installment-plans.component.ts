import { Component, OnInit } from '@angular/core';
import { InstallmentPaymentService } from '../../../services/installment-payment.service';
import { AuthService } from '../../../services/auth.service';
import { InstallmentPlan, InstallmentPayment, InstallmentStatus } from '../../../models/installment-payment.model';

@Component({
  selector: 'app-installment-plans',
  standalone: false,
  templateUrl: './installment-plans.component.html',
  styleUrl: './installment-plans.component.scss'
})
export class InstallmentPlansComponent implements OnInit {
  installmentPlans: InstallmentPlan[] = [];
  selectedPlan: InstallmentPlan | null = null;
  planPayments: InstallmentPayment[] = [];
  installmentStats: any = {};
  loading = false;
  showPaymentsModal = false;

  constructor(
    private installmentService: InstallmentPaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInstallmentPlans();
    this.loadInstallmentStats();
  }

  loadInstallmentPlans(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    this.installmentService.getUserInstallmentPlans(userId).subscribe({
      next: (plans) => {
        this.installmentPlans = plans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading installment plans:', error);
        this.loading = false;
      }
    });
  }

  loadInstallmentStats(): void {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 1;

    this.installmentService.getInstallmentStats(userId).subscribe({
      next: (stats) => {
        this.installmentStats = stats;
      },
      error: (error) => console.error('Error loading stats:', error)
    });
  }

  viewPlanPayments(plan: InstallmentPlan): void {
    this.selectedPlan = plan;
    this.installmentService.getInstallmentPayments(plan.id).subscribe({
      next: (payments) => {
        this.planPayments = payments;
        this.showPaymentsModal = true;
      },
      error: (error) => console.error('Error loading payments:', error)
    });
  }

  makePayment(planId: number, installmentNumber: number): void {
    // Implement payment logic
    console.log('Make payment for plan:', planId, 'installment:', installmentNumber);
  }

  cancelPlan(planId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce plan d\'échelonnement ?')) {
      this.installmentService.cancelInstallmentPlan(planId).subscribe({
        next: () => {
          this.loadInstallmentPlans();
        },
        error: (error) => console.error('Error canceling plan:', error)
      });
    }
  }

  getStatusBadgeClass(status: InstallmentStatus): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'COMPLETED': return 'badge-info';
      case 'OVERDUE': return 'badge-danger';
      case 'CANCELLED': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  getStatusText(status: InstallmentStatus): string {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'COMPLETED': return 'Terminé';
      case 'OVERDUE': return 'En retard';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  }

  calculateProgress(plan: InstallmentPlan): number {
    if (plan.numberOfInstallments === 0) return 0;
    const paidInstallments = plan.numberOfInstallments - (this.getRemainingInstallments(plan) || 0);
    return (paidInstallments / plan.numberOfInstallments) * 100;
  }

  getRemainingInstallments(plan: InstallmentPlan): number {
    // This would need to be calculated based on payments
    return plan.numberOfInstallments; // Placeholder
  }

  closePaymentsModal(): void {
    this.showPaymentsModal = false;
    this.selectedPlan = null;
    this.planPayments = [];
  }
}
