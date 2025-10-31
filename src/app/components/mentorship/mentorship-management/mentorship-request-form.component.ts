import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { MentorshipRequest, MentorshipUrgency } from '../../../models/mentorship-request.model';

@Component({
  selector: 'app-mentorship-request-form',
  templateUrl: './mentorship-request-form.component.html',
  styleUrls: ['./mentorship-request-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipRequestFormComponent {
  requestData = {
    mentorId: null as number | null,
    topic: '',
    message: '',
    urgency: 'MEDIUM' as MentorshipUrgency
  };
  loading = false;
  menteeId = 1; // TODO: Get from authentication service

  constructor(
    private mentorshipService: MentorshipService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.requestData.topic.trim() || !this.requestData.message.trim()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    this.loading = true;
    this.mentorshipService.requestMentorship(
      this.menteeId,
      this.requestData.mentorId,
      this.requestData.topic,
      this.requestData.message
    ).subscribe({
      next: (request) => {
        this.loading = false;
        alert('Demande de mentorat envoyée avec succès!');
        this.router.navigate(['/mentorship/requests']);
      },
      error: (error) => {
        console.error('Error submitting mentorship request:', error);
        this.loading = false;
        alert('Erreur lors de l\'envoi de la demande.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mentorship/mentors']);
  }
}