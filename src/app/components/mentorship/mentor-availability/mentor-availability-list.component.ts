import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorAvailabilityService } from '../../../services/mentor-availability.service';
import { MentorAvailability } from '../../../models/mentor-availability.model';

@Component({
  selector: 'app-mentor-availability-list',
  templateUrl: './mentor-availability-list.component.html',
  styleUrls: ['./mentor-availability-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorAvailabilityListComponent implements OnInit {
  availabilities: MentorAvailability[] = [];
  loading = false;
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

  deleteAvailability(availability: MentorAvailability): void {
    // TODO: Implement delete availability method in service
    console.log('Delete availability:', availability.id);
  }

  editAvailability(availability: MentorAvailability): void {
    // TODO: Navigate to edit component or open modal
    console.log('Edit availability:', availability.id);
  }
}