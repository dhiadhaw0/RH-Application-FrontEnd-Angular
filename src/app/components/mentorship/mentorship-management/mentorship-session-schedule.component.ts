import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { MentorshipSession } from '../../../models/mentorship-session.model';

@Component({
  selector: 'app-mentorship-session-schedule',
  templateUrl: './mentorship-session-schedule.component.html',
  styleUrls: ['./mentorship-session-schedule.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipSessionScheduleComponent implements OnInit {
  requestId: number = 0;
  sessionData = {
    scheduledAt: '',
    durationMinutes: 60,
    location: 'En ligne',
    agenda: ''
  };
  loading = false;
  scheduling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mentorshipService: MentorshipService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.requestId = +params['id'];
    });
  }

  onSubmit(): void {
    if (!this.sessionData.scheduledAt || !this.sessionData.location.trim()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const scheduledDate = new Date(this.sessionData.scheduledAt);
    const now = new Date();

    if (scheduledDate <= now) {
      alert('La date de la session doit être dans le futur.');
      return;
    }

    this.scheduling = true;
    this.mentorshipService.scheduleSession(
      this.requestId,
      this.sessionData.scheduledAt,
      this.sessionData.durationMinutes,
      this.sessionData.location,
      this.sessionData.agenda || null
    ).subscribe({
      next: (session) => {
        this.scheduling = false;
        alert('Session planifiée avec succès!');
        this.router.navigate(['/mentorship/sessions']);
      },
      error: (error) => {
        console.error('Error scheduling session:', error);
        this.scheduling = false;
        alert('Erreur lors de la planification de la session.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mentorship/requests']);
  }

  getMinDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  }
}