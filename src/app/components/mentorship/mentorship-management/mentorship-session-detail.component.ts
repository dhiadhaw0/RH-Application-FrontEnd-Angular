import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { MentorshipSession, Status } from '../../../models/mentorship-session.model';

@Component({
  selector: 'app-mentorship-session-detail',
  templateUrl: './mentorship-session-detail.component.html',
  styleUrls: ['./mentorship-session-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipSessionDetailComponent implements OnInit {
  sessionId: number = 0;
  session: MentorshipSession | null = null;
  loading = false;
  isMentor = false; // TODO: Get from user role
  mentorNotes = '';
  menteeNotes = '';

  constructor(
    private route: ActivatedRoute,
    private mentorshipService: MentorshipService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = +params['id'];
      this.loadSessionDetail();
    });
  }

  loadSessionDetail(): void {
    this.loading = true;
    // TODO: Implement API call to get session details
    // For now, load mock data
    setTimeout(() => {
      this.session = {
        id: this.sessionId,
        mentorshipRequest: {
          id: 1,
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
          description: 'Besoin d\'aide pour apprendre React et les hooks',
          requestedAt: new Date(),
          status: 'ACCEPTED' as any,
          urgency: 'MEDIUM' as any
        },
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        durationMinutes: 60,
        location: 'En ligne',
        agenda: 'Introduction à React, composants, props et state',
        mentorNotes: 'Session très productive. Le mentee a bien progressé.',
        menteeNotes: 'Excellente session, beaucoup appris.',
        status: Status.SCHEDULED
      };
      this.mentorNotes = this.session.mentorNotes || '';
      this.menteeNotes = this.session.menteeNotes || '';
      this.loading = false;
    }, 1000);
  }

  saveMentorNotes(): void {
    if (!this.session) return;

    this.mentorshipService.addMentorNotes(this.session.id, this.mentorNotes).subscribe({
      next: () => {
        alert('Notes du mentor enregistrées!');
        if (this.session) {
          this.session.mentorNotes = this.mentorNotes;
        }
      },
      error: (error) => {
        console.error('Error saving mentor notes:', error);
        alert('Erreur lors de l\'enregistrement des notes.');
      }
    });
  }

  saveMenteeNotes(): void {
    if (!this.session) return;

    this.mentorshipService.addMenteeNotes(this.session.id, this.menteeNotes).subscribe({
      next: () => {
        alert('Notes du mentee enregistrées!');
        if (this.session) {
          this.session.menteeNotes = this.menteeNotes;
        }
      },
      error: (error) => {
        console.error('Error saving mentee notes:', error);
        alert('Erreur lors de l\'enregistrement des notes.');
      }
    });
  }

  completeSession(): void {
    if (!this.session) return;

    this.mentorshipService.completeSession(this.session.id).subscribe({
      next: (updatedSession) => {
        this.session = updatedSession;
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

  isUpcoming(): boolean {
    return this.session ? new Date(this.session.scheduledAt) > new Date() : false;
  }

  canComplete(): boolean {
    if (!this.session) return false;
    const sessionEnd = new Date(this.session.scheduledAt);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + this.session.durationMinutes);
    return this.session.status === Status.SCHEDULED && sessionEnd < new Date();
  }
}