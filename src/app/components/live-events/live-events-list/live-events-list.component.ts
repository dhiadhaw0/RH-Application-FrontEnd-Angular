import { Component, OnInit } from '@angular/core';
import { LiveEventService } from '../../../services/live-event.service';
import { LiveEvent } from '../../../models/live-event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-events-list',
  standalone: false,
  templateUrl: './live-events-list.component.html',
  styleUrl: './live-events-list.component.scss'
})
export class LiveEventsListComponent implements OnInit {
  events: LiveEvent[] = [];
  upcomingEvents: LiveEvent[] = [];
  pastEvents: LiveEvent[] = [];
  loading = false;
  participantsCount: { [eventId: number]: number } = {};

  constructor(
    private liveEventService: LiveEventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.liveEventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.categorizeEvents();
        this.loadParticipantsCounts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  loadParticipantsCounts(): void {
    this.events.forEach(event => {
      if (event.status !== 'ended') {
        this.liveEventService.getParticipants(event.id).subscribe({
          next: (participants) => {
            this.participantsCount[event.id] = participants.length;
          },
          error: (error) => {
            console.error(`Error loading participants for event ${event.id}:`, error);
            this.participantsCount[event.id] = 0;
          }
        });
      }
    });
  }

  categorizeEvents(): void {
    const now = new Date();
    this.upcomingEvents = this.events.filter(event => new Date(event.startTime) > now);
    this.pastEvents = this.events.filter(event => new Date(event.endTime) < now);
  }

  viewEvent(event: LiveEvent): void {
    this.router.navigate(['/live-events', event.id]);
  }

  registerForEvent(event: LiveEvent): void {
    this.liveEventService.registerForEvent(event.id).subscribe({
      next: () => {
        // Refresh events or update UI
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error registering for event:', error);
      }
    });
  }

  createEvent(): void {
    this.router.navigate(['/live-events/create']);
  }
}
