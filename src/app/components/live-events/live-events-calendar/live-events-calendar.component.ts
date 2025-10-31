import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LiveEventService } from '../../../services/live-event.service';
import { LiveEvent } from '../../../models/live-event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-events-calendar',
  standalone: false,
  templateUrl: './live-events-calendar.component.html',
  styleUrl: './live-events-calendar.component.scss'
})
export class LiveEventsCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    height: 'auto'
  };

  events: LiveEvent[] = [];
  loading = false;

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
        this.updateCalendarEvents();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  updateCalendarEvents(): void {
    const calendarEvents = this.events.map(event => ({
      id: event.id.toString(),
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      backgroundColor: this.getEventColor(event.status),
      borderColor: this.getEventColor(event.status),
      textColor: '#ffffff',
      extendedProps: {
        event: event
      }
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: calendarEvents
    };
  }

  getEventColor(status: string): string {
    switch (status) {
      case 'live':
        return '#dc3545';
      case 'scheduled':
        return '#ffc107';
      case 'ended':
        return '#6c757d';
      default:
        return '#007bff';
    }
  }

  handleEventClick(info: any): void {
    const eventId = parseInt(info.event.id);
    this.router.navigate(['/live-events', eventId]);
  }

  handleDateClick(info: any): void {
    // Could open a modal to create event on this date
    console.log('Date clicked:', info.dateStr);
  }

  createEvent(): void {
    this.router.navigate(['/live-events/create']);
  }

  viewList(): void {
    this.router.navigate(['/live-events']);
  }
}
