import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { MentorshipRequest, MentorshipRequestStatus } from '../../../models/mentorship-request.model';

@Component({
  selector: 'app-mentorship-request-list',
  templateUrl: './mentorship-request-list.component.html',
  styleUrls: ['./mentorship-request-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipRequestListComponent implements OnInit {
  requests: MentorshipRequest[] = [];
  loading = false;
  userId = 1; // TODO: Get from authentication service
  isMentor = false; // TODO: Get from user role

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;

    if (this.isMentor) {
      this.mentorshipService.getRequestsForMentor(this.userId).subscribe({
        next: (requests) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading mentor requests:', error);
          this.loading = false;
          this.loadMockMentorRequests();
        }
      });
    } else {
      // For mentees, we would need a method to get their sent requests
      // For now, load mock data
      this.loadMockMenteeRequests();
    }
  }

  private loadMockMentorRequests(): void {
    this.requests = [
      {
        id: 1,
        mentee: {
          id: 2,
          email: 'mentee@example.com',
          firstName: 'Alice',
          lastName: 'Dubois',
          dateOfBirth: new Date('1995-05-15'),
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
          dateOfBirth: new Date('1985-03-15'),
          createdAt: new Date(),
          isMentor: true,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        topic: 'Développement React',
        description: 'Besoin d\'aide pour apprendre React et les hooks',
        requestedAt: new Date('2024-01-15'),
        status: MentorshipRequestStatus.PENDING,
        urgency: 'MEDIUM' as any
      }
    ];
  }

  private loadMockMenteeRequests(): void {
    this.requests = [
      {
        id: 1,
        mentee: {
          id: 1,
          email: 'mentee@example.com',
          firstName: 'Alice',
          lastName: 'Dubois',
          dateOfBirth: new Date('1995-05-15'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        mentor: {
          id: 2,
          email: 'mentor@example.com',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1985-03-15'),
          createdAt: new Date(),
          isMentor: true,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        topic: 'Développement React',
        description: 'Besoin d\'aide pour apprendre React et les hooks',
        requestedAt: new Date('2024-01-15'),
        status: MentorshipRequestStatus.PENDING,
        urgency: 'MEDIUM' as any
      }
    ];
    this.loading = false;
  }

  respondToRequest(request: MentorshipRequest, accept: boolean): void {
    if (!this.isMentor) return;

    this.mentorshipService.respondToRequest(request.id, accept).subscribe({
      next: (updatedRequest) => {
        // Update the request in the list
        const index = this.requests.findIndex(r => r.id === request.id);
        if (index !== -1) {
          this.requests[index] = updatedRequest;
        }
        alert(accept ? 'Demande acceptée!' : 'Demande rejetée!');
      },
      error: (error) => {
        console.error('Error responding to request:', error);
        alert('Erreur lors de la réponse à la demande.');
      }
    });
  }

  getStatusColor(status: MentorshipRequestStatus): string {
    switch (status) {
      case MentorshipRequestStatus.PENDING: return '#ffc107';
      case MentorshipRequestStatus.ACCEPTED: return '#28a745';
      case MentorshipRequestStatus.REJECTED: return '#dc3545';
      case MentorshipRequestStatus.COMPLETED: return '#17a2b8';
      default: return '#6c757d';
    }
  }

  getStatusText(status: MentorshipRequestStatus): string {
    switch (status) {
      case MentorshipRequestStatus.PENDING: return 'En attente';
      case MentorshipRequestStatus.ACCEPTED: return 'Acceptée';
      case MentorshipRequestStatus.REJECTED: return 'Rejetée';
      case MentorshipRequestStatus.COMPLETED: return 'Terminée';
      default: return 'Inconnue';
    }
  }

  getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'LOW': return '#28a745';
      case 'MEDIUM': return '#ffc107';
      case 'HIGH': return '#fd7e14';
      case 'URGENT': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getUrgencyText(urgency: string): string {
    switch (urgency) {
      case 'LOW': return 'Faible';
      case 'MEDIUM': return 'Moyen';
      case 'HIGH': return 'Élevé';
      case 'URGENT': return 'Urgent';
      default: return 'Inconnue';
    }
  }
}