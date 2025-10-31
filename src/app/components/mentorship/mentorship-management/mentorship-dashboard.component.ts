import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { MentorshipRequest, MentorshipRequestStatus } from '../../../models/mentorship-request.model';
import { MentorshipSession, Status } from '../../../models/mentorship-session.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-mentorship-dashboard',
  templateUrl: './mentorship-dashboard.component.html',
  styleUrls: ['./mentorship-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipDashboardComponent implements OnInit {
  userId = 1; // TODO: Get from authentication service
  isMentor = false; // TODO: Get from user role

  // Stats
  stats = {
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0
  };

  // Recent data
  recentRequests: MentorshipRequest[] = [];
  upcomingSessions: MentorshipSession[] = [];
  recentSessions: MentorshipSession[] = [];

  loading = false;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load mock data for demonstration
    this.loadMockData();

    // In real implementation, these would be separate API calls
    // this.loadStats();
    // this.loadRecentRequests();
    // this.loadUpcomingSessions();
    // this.loadRecentSessions();
  }

  private loadMockData(): void {
    // Mock stats
    this.stats = {
      totalRequests: 12,
      pendingRequests: 3,
      acceptedRequests: 8,
      completedSessions: 15,
      upcomingSessions: 4,
      averageRating: 4.7
    };

    // Mock recent requests
    this.recentRequests = [
      {
        id: 1,
        mentee: {
          id: 2,
          email: 'alice@example.com',
          firstName: 'Alice',
          lastName: 'Dubois',
          dateOfBirth: new Date(),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        mentor: {
          id: 1,
          email: 'mentor@example.com',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date(),
          createdAt: new Date(),
          isMentor: true,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        topic: 'React Development',
        description: 'Need help with React hooks',
        requestedAt: new Date(),
        status: MentorshipRequestStatus.PENDING,
        urgency: 'MEDIUM' as any
      }
    ];

    // Mock upcoming sessions
    this.upcomingSessions = [
      {
        id: 1,
        mentorshipRequest: {
          id: 1,
          mentee: { id: 2, email: '', firstName: 'Alice', lastName: 'Dubois', dateOfBirth: new Date(), createdAt: new Date(), isMentor: false, banned: false, isModerator: false, role: 'USER' as any },
          mentor: { id: 1, email: '', firstName: 'John', lastName: 'Doe', dateOfBirth: new Date(), createdAt: new Date(), isMentor: true, banned: false, isModerator: false, role: 'USER' as any },
          topic: 'React Development',
          description: '',
          requestedAt: new Date(),
          status: 'ACCEPTED' as any,
          urgency: 'MEDIUM' as any
        },
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        durationMinutes: 60,
        location: 'En ligne',
        agenda: 'React hooks introduction',
        status: Status.SCHEDULED
      }
    ];

    // Mock recent sessions
    this.recentSessions = [
      {
        id: 2,
        mentorshipRequest: {
          id: 2,
          mentee: { id: 3, email: '', firstName: 'Bob', lastName: 'Martin', dateOfBirth: new Date(), createdAt: new Date(), isMentor: false, banned: false, isModerator: false, role: 'USER' as any },
          mentor: { id: 1, email: '', firstName: 'John', lastName: 'Doe', dateOfBirth: new Date(), createdAt: new Date(), isMentor: true, banned: false, isModerator: false, role: 'USER' as any },
          topic: 'Data Science',
          description: '',
          requestedAt: new Date(),
          status: 'ACCEPTED' as any,
          urgency: 'HIGH' as any
        },
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        durationMinutes: 90,
        location: 'En ligne',
        agenda: 'Python for data science',
        status: Status.COMPLETED
      }
    ];

    this.loading = false;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
      case 'SCHEDULED':
        return '#ffc107';
      case 'ACCEPTED':
      case 'COMPLETED':
        return '#28a745';
      case 'REJECTED':
      case 'CANCELLED':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'ACCEPTED': return 'Acceptée';
      case 'REJECTED': return 'Rejetée';
      case 'COMPLETED': return 'Terminée';
      case 'SCHEDULED': return 'Planifiée';
      case 'CANCELLED': return 'Annulée';
      default: return 'Inconnue';
    }
  }
}