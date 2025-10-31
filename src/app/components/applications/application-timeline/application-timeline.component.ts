import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute , RouterModule} from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ApplicationService } from '../../../services/application.service';
import { Application, StatutCandidature } from '../../../models/application.model';

interface TimelineEvent {
  id: string;
  type: 'CREATION' | 'STATUS_CHANGE' | 'INTERVIEW' | 'TEST' | 'DOCUMENT' | 'AI_ANALYSIS';
  title: string;
  description: string;
  timestamp: Date;
  details?: any;
}

@Component({
  selector: 'app-application-timeline',

  templateUrl: './application-timeline.component.html',
  styleUrls: ['./application-timeline.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent]
})
export class ApplicationTimelineComponent implements OnInit {
  applicationId: number = 0;
  timelineEvents: TimelineEvent[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.applicationId = +this.route.snapshot.params['id'];
    if (this.applicationId) {
      this.loadTimeline();
    }
  }

  loadTimeline(): void {
    this.loading = true;
    this.applicationService.getApplicationTimeline(this.applicationId).subscribe({
      next: (timelineData) => {
        this.timelineEvents = this.processTimelineData(timelineData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading timeline:', error);
        this.loading = false;
      }
    });
  }

  processTimelineData(timelineData: any): TimelineEvent[] {
    // This is a mock processing - in real implementation, you'd process the actual timeline data
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'CREATION',
        title: 'Candidature créée',
        description: 'La candidature a été créée avec succès.',
        timestamp: new Date('2024-01-15T10:00:00'),
        details: {}
      },
      {
        id: '2',
        type: 'STATUS_CHANGE',
        title: 'Statut changé',
        description: 'Le statut de la candidature a été mis à jour.',
        timestamp: new Date('2024-01-16T14:30:00'),
        details: {
          oldStatus: StatutCandidature.EN_ATTENTE,
          newStatus: StatutCandidature.EN_COURS_DE_TRAITEMENT,
          reason: 'Validation initiale effectuée'
        }
      },
      {
        id: '3',
        type: 'AI_ANALYSIS',
        title: 'Analyse IA effectuée',
        description: 'L\'analyse automatique de la candidature a été réalisée.',
        timestamp: new Date('2024-01-17T09:15:00'),
        details: {
          relevanceScore: 8.5,
          aiScore: 7.8,
          report: 'Candidature très pertinente avec de bonnes compétences techniques.'
        }
      },
      {
        id: '4',
        type: 'DOCUMENT',
        title: 'Document ajouté',
        description: 'Un nouveau document a été ajouté à la candidature.',
        timestamp: new Date('2024-01-18T11:45:00'),
        details: {
          documentName: 'CV_Martin_Dupont.pdf',
          documentType: 'CV',
          fileSize: 2048576
        }
      },
      {
        id: '5',
        type: 'INTERVIEW',
        title: 'Entretien planifié',
        description: 'Un entretien a été planifié avec le candidat.',
        timestamp: new Date('2024-01-20T16:00:00'),
        details: {
          interviewType: 'TECHNIQUE',
          scheduledAt: '2024-01-25T10:00:00',
          status: 'PROGRAMME'
        }
      }
    ];

    // Sort by timestamp (most recent first)
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'CREATION': return 'fas fa-plus-circle';
      case 'STATUS_CHANGE': return 'fas fa-exchange-alt';
      case 'INTERVIEW': return 'fas fa-user-tie';
      case 'TEST': return 'fas fa-clipboard-check';
      case 'DOCUMENT': return 'fas fa-file-alt';
      case 'AI_ANALYSIS': return 'fas fa-brain';
      default: return 'fas fa-circle';
    }
  }

  getEventTitle(event: TimelineEvent): string {
    return event.title;
  }

  getEventDescription(event: TimelineEvent): string {
    return event.description;
  }

  canRevertEvent(event: TimelineEvent): boolean {
    // Logic to determine if an event can be reverted
    return event.type === 'STATUS_CHANGE' && event.details?.oldStatus;
  }

  revertEvent(event: TimelineEvent): void {
    // TODO: Implement event reversion logic
    console.log('Reverting event:', event.id);
  }

  trackByEventId(index: number, event: TimelineEvent): string {
    return event.id;
  }

  getCreationDate(): Date {
    const creationEvent = this.timelineEvents.find(event => event.type === 'CREATION');
    return creationEvent ? creationEvent.timestamp : new Date();
  }

  getLastActivityDate(): Date {
    return this.timelineEvents.length > 0 ? this.timelineEvents[0].timestamp : new Date();
  }

  getCurrentStatus(): string {
    const statusChangeEvents = this.timelineEvents.filter(event => event.type === 'STATUS_CHANGE');
    if (statusChangeEvents.length > 0) {
      return statusChangeEvents[0].details?.newStatus || 'INCONNU';
    }
    return 'EN_ATTENTE';
  }

  getDocumentCount(): number {
    return this.timelineEvents.filter(event => event.type === 'DOCUMENT').length;
  }

  getDaysSinceCreation(): number {
    const creationDate = this.getCreationDate();
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - creationDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}