import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorAvailabilityService } from '../../../services/mentor-availability.service';
import { MentorAvailability } from '../../../models/mentor-availability.model';

@Component({
  selector: 'app-mentor-availability-calendar',
  templateUrl: './mentor-availability-calendar.component.html',
  styleUrls: ['./mentor-availability-calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorAvailabilityCalendarComponent implements OnInit {
  availabilities: MentorAvailability[] = [];
  loading = false;
  currentDate = new Date();
  selectedDate: Date | null = null;
  mentorId = 1; // TODO: Get from authentication service

  constructor(private availabilityService: MentorAvailabilityService) {}

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  loadAvailabilities(): void {
    this.loading = true;
    this.availabilityService.listAllSlots(this.mentorId).subscribe({
      next: (availabilities) => {
        this.availabilities = availabilities;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading availabilities:', error);
        this.loading = false;
        // Fallback to mock data if API fails
        this.availabilities = [
          {
            id: 1,
            mentor: {
              id: this.mentorId,
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
            startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            isBooked: false
          }
        ];
      }
    });
  }

  getDaysInMonth(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add previous month's days to fill the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let d = new Date(startDate); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  }

  getAvailabilitiesForDate(date: Date): MentorAvailability[] {
    return this.availabilities.filter(availability => {
      const availabilityDate = new Date(availability.startDateTime);
      return availabilityDate.toDateString() === date.toDateString();
    });
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth() &&
           date.getFullYear() === this.currentDate.getFullYear();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.selectedDate = null;
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.selectedDate = null;
  }

  getMonthName(): string {
    return this.currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  getWeekDays(): string[] {
    return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  }

  editAvailability(availability: MentorAvailability): void {
    // TODO: Navigate to edit component or open modal
    console.log('Edit availability:', availability.id);
  }

  deleteAvailability(availability: MentorAvailability): void {
    // TODO: Implement delete availability method in service
    console.log('Delete availability:', availability.id);
  }
}