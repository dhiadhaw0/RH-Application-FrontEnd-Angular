import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumReportService } from '../../../services/forum-report.service';
import { ForumService } from '../../../services/forum.service';
import { ForumReport, Status, ActionTaken } from '../../../models/forum-report.model';
import { ForumThread } from '../../../models/forum-thread.model';
import { ForumPost } from '../../../models/forum-post.model';

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalThreads: number;
  pinnedThreads: number;
  closedThreads: number;
  totalPosts: number;
  answeredPosts: number;
}

@Component({
  selector: 'app-forum-moderation-dashboard',
  templateUrl: './forum-moderation-dashboard.component.html',
  styleUrl: './forum-moderation-dashboard.component.scss'
})
export class ForumModerationDashboardComponent implements OnInit {
  stats: ModerationStats = {
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    totalThreads: 0,
    pinnedThreads: 0,
    closedThreads: 0,
    totalPosts: 0,
    answeredPosts: 0
  };

  recentReports: ForumReport[] = [];
  recentThreads: ForumThread[] = [];
  recentPosts: ForumPost[] = [];

  loading = true;
  activeTab: 'overview' | 'reports' | 'threads' | 'posts' = 'overview';

  constructor(
    private reportService: ForumReportService,
    private forumService: ForumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load reports
    this.reportService.listReports(Status.PENDING).subscribe({
      next: (reports) => {
        this.recentReports = reports.slice(0, 10);
        this.stats.totalReports = reports.length;
        this.stats.pendingReports = reports.filter(r => r.status === Status.PENDING).length;
        this.stats.resolvedReports = reports.filter(r => r.status === Status.ACTIONED).length;
      },
      error: (err) => console.error('Error loading reports:', err)
    });

    // Load threads (this would need to be implemented in the service)
    // For now, using placeholder data
    this.stats.totalThreads = 150;
    this.stats.pinnedThreads = 5;
    this.stats.closedThreads = 12;

    // Load posts (this would need to be implemented in the service)
    this.stats.totalPosts = 1200;
    this.stats.answeredPosts = 45;

    this.loading = false;
  }

  setActiveTab(tab: 'overview' | 'reports' | 'threads' | 'posts'): void {
    this.activeTab = tab;
  }

  resolveReport(reportId: number): void {
    // Assuming moderator ID is 1 for now - this should come from auth service
    this.reportService.moderateReport(reportId, 1, 'Résolu par modérateur', ActionTaken.NONE).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => console.error('Error resolving report:', err)
    });
  }

  pinThread(threadId: number): void {
    this.forumService.pinThread(threadId, true).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => console.error('Error pinning thread:', err)
    });
  }

  closeThread(threadId: number): void {
    this.forumService.closeThread(threadId, true).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => console.error('Error closing thread:', err)
    });
  }

  markAsAnswer(postId: number): void {
    this.forumService.markAsAnswer(postId, true).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => console.error('Error marking post as answer:', err)
    });
  }

  deleteThread(threadId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fil de discussion ? Cette action est irréversible.')) {
      // Simulate deletion - in real implementation, call service
      console.log('Deleting thread:', threadId);
      this.loadDashboardData();
    }
  }

  moveThread(threadId: number): void {
    const newCategoryId = prompt('Entrez l\'ID de la nouvelle catégorie:');
    if (newCategoryId) {
      // Simulate move - in real implementation, call service
      console.log('Moving thread:', threadId, 'to category:', newCategoryId);
      this.loadDashboardData();
    }
  }

  hidePost(postId: number): void {
    // Simulate hide - in real implementation, call service
    console.log('Hiding post:', postId);
    this.loadDashboardData();
  }

  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.')) {
      // Simulate deletion - in real implementation, call service
      console.log('Deleting post:', postId);
      this.loadDashboardData();
    }
  }

  editPost(postId: number): void {
    // Navigate to post edit page
    console.log('Edit post:', postId);
    // this.router.navigate(['/forum', 'post', 'edit', postId]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#f39c12';
      case 'RESOLVED': return '#27ae60';
      case 'DISMISSED': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'RESOLVED': return 'Résolu';
      case 'DISMISSED': return 'Rejeté';
      default: return status;
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

  goBackToForum(): void {
    this.router.navigate(['/forum']);
  }

  navigateToReports(): void {
    this.router.navigate(['/forum', 'reports']);
  }

  navigateToSearch(): void {
    this.router.navigate(['/forum', 'search']);
  }
}
