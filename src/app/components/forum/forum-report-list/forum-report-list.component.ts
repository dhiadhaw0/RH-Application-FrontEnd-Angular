import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumReportService } from '../../../services/forum-report.service';
import { ForumReport, Status } from '../../../models/forum-report.model';

@Component({
  selector: 'app-forum-report-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum-report-list.component.html',
  styleUrl: './forum-report-list.component.scss'
})
export class ForumReportListComponent implements OnInit {
  reports: ForumReport[] = [];
  loading = true;
  error: string | null = null;
  selectedStatus: Status = Status.PENDING;
  statusOptions = Object.values(Status);

  constructor(private reportService: ForumReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.reportService.listReports(this.selectedStatus).subscribe({
      next: (reports) => {
        this.reports = reports;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des signalements';
        this.loading = false;
        console.error('Error loading reports:', err);
      }
    });
  }

  onStatusChange(): void {
    this.loadReports();
  }

  getStatusBadgeClass(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'status-pending';
      case Status.REVIEWED:
        return 'status-reviewed';
      case Status.ACTIONED:
        return 'status-actioned';
      case Status.DISMISSED:
        return 'status-dismissed';
      default:
        return '';
    }
  }

  getStatusLabel(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'En attente';
      case Status.REVIEWED:
        return 'Examiné';
      case Status.ACTIONED:
        return 'Actionné';
      case Status.DISMISSED:
        return 'Rejeté';
      default:
        return status;
    }
  }

  getActionTakenLabel(action: string): string {
    switch (action) {
      case 'NONE':
        return 'Aucune';
      case 'WARNED':
        return 'Avertissement';
      case 'DELETED':
        return 'Supprimé';
      case 'BANNED':
        return 'Banni';
      case 'DISMISSED':
        return 'Rejeté';
      default:
        return action;
    }
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
}
