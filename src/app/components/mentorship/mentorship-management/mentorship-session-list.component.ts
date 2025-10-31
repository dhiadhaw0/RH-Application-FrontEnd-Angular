import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { MentorshipSession, Status } from '../../../models/mentorship-session.model';

@Component({
  selector: 'app-mentorship-session-list',
  templateUrl: './mentorship-session-list.component.html',
  styleUrls: ['./mentorship-session-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipSessionListComponent implements OnInit {
  sessions: MentorshipSession[] = [];
  loading = false;
  userId = 1; // TODO: Get from authentication service
  isMentor = false; // TODO: Get from user role

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.mentorshipService.getSessionsForUser(this.userId).subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.loading = false;
        this.loadMockSessions();
      }
    });
  }

  private loadMockSessions(): void {
    this.sessions = [
      {
        id: 1,
        mentorshipRequest: {
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
          description: 'Apprendre React et les hooks',
          requestedAt: new Date(),
          status: 'ACCEPTED' as any,
          urgency: 'MEDIUM' as any
        },
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        durationMinutes: 60,
        location: 'En ligne',
        agenda: 'Introduction à React, composants, props et state',
        mentorNotes: '',
        menteeNotes: '',
        status: Status.SCHEDULED
      },
      {
        id: 2,
        mentorshipRequest: {
          id: 2,
          mentee: {
            id: 3,
            email: 'mentee2@example.com',
            firstName: 'Bob',
            lastName: 'Martin',
            dateOfBirth: new Date('1990-08-20'),
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
          topic: 'Data Science',
          description: 'Apprendre Python pour la data science',
          requestedAt: new Date(),
          status: 'ACCEPTED' as any,
          urgency: 'HIGH' as any
        },
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
        durationMinutes: 90,
        location: 'En ligne',
        agenda: 'Python basics, pandas, numpy',
        mentorNotes: 'Session très productive. Le mentee a bien progressé.',
        menteeNotes: 'Excellente session, beaucoup appris.',
        status: Status.COMPLETED
      }
    ];
    this.loading = false;
  }

  completeSession(session: MentorshipSession): void {
    this.mentorshipService.completeSession(session.id).subscribe({
      next: (updatedSession) => {
        // Update the session in the list
        const index = this.sessions.findIndex(s => s.id === session.id);
        if (index !== -1) {
          this.sessions[index] = updatedSession;
        }
        alert('Session marquée comme terminée!');
      },
      error: (error) => {
        console.error('Error completing session:', error);
        alert('Erreur lors de la finalisation de la session.');
      }
    });
  }

  getStatusColor(status: Status): string {
    switch (status) {
      case Status.SCHEDULED: return '#ffc107';
      case Status.COMPLETED: return '#28a745';
      case Status.CANCELLED: return '#dc3545';
      default: return '#6c757d';
    }
  }

  getStatusText(status: Status): string {
    switch (status) {
      case Status.SCHEDULED: return 'Planifiée';
      case Status.COMPLETED: return 'Terminée';
      case Status.CANCELLED: return 'Annulée';
      default: return 'Inconnue';
    }
  }

  isUpcoming(session: MentorshipSession): boolean {
    return new Date(session.scheduledAt) > new Date();
  }

  canComplete(session: MentorshipSession): boolean {
    const sessionEnd = new Date(session.scheduledAt);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + session.durationMinutes);
    return session.status === Status.SCHEDULED && sessionEnd < new Date();
  }
}