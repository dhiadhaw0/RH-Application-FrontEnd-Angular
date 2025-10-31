import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipRequest, MentorshipRequestStatus } from '../../../models/mentorship-request.model';

@Component({
  selector: 'app-mentorship-request-detail',
  templateUrl: './mentorship-request-detail.component.html',
  styleUrls: ['./mentorship-request-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipRequestDetailComponent implements OnInit {
  requestId: number = 0;
  request: MentorshipRequest | null = null;
  loading = false;
  isMentor = false; // TODO: Get from user role

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.requestId = +params['id'];
      this.loadRequestDetail();
    });
  }

  loadRequestDetail(): void {
    this.loading = true;
    // TODO: Implement API call to get request details
    // For now, load mock data
    setTimeout(() => {
      this.request = {
        id: this.requestId,
        mentee: {
          id: 2,
          email: 'alice.dubois@example.com',
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
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1985-03-15'),
          createdAt: new Date(),
          isMentor: true,
          mentorBio: 'Expert en développement web',
          mentorExpertise: 'Développement Web, JavaScript, React',
          languages: 'Français, Anglais',
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        topic: 'Apprendre React et les hooks',
        description: 'Bonjour, je suis développeur junior et je souhaite apprendre React, particulièrement les hooks et la gestion d\'état. J\'ai déjà des bases en JavaScript et HTML/CSS. Je cherche un mentor qui pourrait m\'accompagner dans mon apprentissage avec des sessions hebdomadaires.',
        requestedAt: new Date('2024-01-15T10:30:00'),
        status: MentorshipRequestStatus.PENDING,
        urgency: 'MEDIUM' as any
      };
      this.loading = false;
    }, 1000);
  }

  respondToRequest(accept: boolean): void {
    if (!this.request || !this.isMentor) return;

    // TODO: Implement API call to respond to request
    console.log(`${accept ? 'Accepting' : 'Rejecting'} request ${this.request.id}`);

    // Update status locally for demo
    if (this.request) {
      this.request.status = accept ? MentorshipRequestStatus.ACCEPTED : MentorshipRequestStatus.REJECTED;
    }

    alert(accept ? 'Demande acceptée!' : 'Demande rejetée!');
  }

  scheduleSession(): void {
    if (!this.request) return;
    // Navigate to session scheduling
    console.log('Schedule session for request:', this.request.id);
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