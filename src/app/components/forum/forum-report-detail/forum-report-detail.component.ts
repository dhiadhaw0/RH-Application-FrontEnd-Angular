import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumReport, Status, ActionTaken } from '../../../models/forum-report.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-report-detail',
  templateUrl: './forum-report-detail.component.html',
  styleUrl: './forum-report-detail.component.scss'
})
export class ForumReportDetailComponent implements OnInit {
  reportId: number = 0;
  report: ForumReport | null = null;
  currentUser: User | null = null;
  loading = true;
  error: string | null = null;
  moderationForm: FormGroup;
  submitting = false;

  statusOptions = [
    { value: Status.PENDING, label: 'En attente', color: 'warning' },
    { value: Status.REVIEWED, label: 'Examiné', color: 'info' },
    { value: Status.ACTIONED, label: 'Action prise', color: 'success' },
    { value: Status.DISMISSED, label: 'Rejeté', color: 'secondary' }
  ];

  actionOptions = [
    { value: ActionTaken.NONE, label: 'Aucune action', color: 'secondary' },
    { value: ActionTaken.WARNED, label: 'Avertissement envoyé', color: 'warning' },
    { value: ActionTaken.DELETED, label: 'Contenu supprimé', color: 'danger' },
    { value: ActionTaken.BANNED, label: 'Utilisateur banni', color: 'danger' },
    { value: ActionTaken.DISMISSED, label: 'Signalement rejeté', color: 'secondary' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.moderationForm = this.fb.group({
      status: [Status.PENDING, Validators.required],
      actionTaken: [ActionTaken.NONE, Validators.required],
      moderatorComment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = +params['reportId'];
      if (this.reportId) {
        this.loadReport();
      }
    });
  }

  loadReport(): void {
    this.loading = true;
    // This would typically call a service method to get the report
    // For now, we'll simulate loading a report
    setTimeout(() => {
      this.report = this.generateMockReport();
      if (this.report) {
        this.moderationForm.patchValue({
          status: this.report.status,
          actionTaken: this.report.actionTaken,
          moderatorComment: this.report.moderatorComment || ''
        });
      }
      this.loading = false;
    }, 1000);
  }

  private generateMockReport(): ForumReport {
    // Mock data for demonstration
    return {
      id: this.reportId,
      reporter: {
        id: 1,
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@example.com',
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        isMentor: false,
        banned: false,
        isModerator: false,
        role: 'USER' as any
      },
      reportedPost: {
        id: 1,
        thread: {} as any, // Simplified for demo
        author: {
          id: 2,
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@example.com',
          dateOfBirth: new Date('1985-05-15'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        content: 'Contenu inapproprié qui a été signalé par un utilisateur.',
        createdAt: new Date(Date.now() - 3600000),
        isAnswer: false,
        anonymous: false
      },
      reason: 'Contenu offensant et inapproprié',
      status: Status.PENDING,
      createdAt: new Date(Date.now() - 1800000),
      actionTaken: ActionTaken.NONE
    };
  }

  onSubmit(): void {
    if (this.moderationForm.valid && this.report) {
      this.submitting = true;
      const formValue = this.moderationForm.value;

      // Update the report with moderation decisions
      const updatedReport = {
        ...this.report,
        status: formValue.status,
        actionTaken: formValue.actionTaken,
        moderatorComment: formValue.moderatorComment,
        moderator: this.currentUser || undefined
      };

      // Simulate API call
      setTimeout(() => {
        this.submitting = false;
        // In real implementation, this would emit the updated report
        this.router.navigate(['/forum/moderation/dashboard']);
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  getStatusColor(status: Status): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'secondary';
  }

  getActionColor(action: ActionTaken): string {
    const option = this.actionOptions.find(opt => opt.value === action);
    return option ? option.color : 'secondary';
  }

  getStatusLabel(status: Status): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Inconnu';
  }

  getActionLabel(action: ActionTaken): string {
    const option = this.actionOptions.find(opt => opt.value === action);
    return option ? option.label : 'Aucune';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/forum/moderation/dashboard']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.moderationForm.controls).forEach(key => {
      const control = this.moderationForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.moderationForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.moderationForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
