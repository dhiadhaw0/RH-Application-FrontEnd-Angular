import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorAvailabilityService } from '../../../services/mentor-availability.service';
import { MentorAvailability } from '../../../models/mentor-availability.model';
import { MentorshipSession } from '../../../models/mentorship-session.model';

@Component({
  selector: 'app-mentor-slot-booking',
  templateUrl: './mentor-slot-booking.component.html',
  styleUrls: ['./mentor-slot-booking.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorSlotBookingComponent implements OnInit {
  slotId: number = 0;
  availability: MentorAvailability | null = null;
  loading = false;
  booking = false;
  menteeId = 1; // TODO: Get from authentication service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private availabilityService: MentorAvailabilityService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slotId = +params['id'];
      this.loadSlotDetails();
    });
  }

  loadSlotDetails(): void {
    this.loading = true;
    // TODO: Add method to get single availability slot
    // For now, we'll simulate loading
    setTimeout(() => {
      this.availability = {
        id: this.slotId,
        mentor: {
          id: 1,
          email: 'mentor@example.com',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date(),
          createdAt: new Date(),
          isMentor: true,
          mentorBio: 'Experienced software engineer',
          role: 'USER' as any,
          banned: false,
          isModerator: false
        },
        startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        isBooked: false
      };
      this.loading = false;
    }, 1000);
  }

  bookSlot(): void {
    if (!this.availability || this.availability.isBooked) return;

    this.booking = true;
    this.availabilityService.bookSlot(this.slotId, this.menteeId).subscribe({
      next: (session: MentorshipSession) => {
        this.booking = false;
        alert('Créneau réservé avec succès!');
        this.router.navigate(['/mentorship/sessions']);
      },
      error: (error) => {
        console.error('Error booking slot:', error);
        this.booking = false;
        alert('Erreur lors de la réservation du créneau.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mentorship/mentors']);
  }

  getDuration(): number {
    if (!this.availability) return 0;
    const start = new Date(this.availability.startDateTime);
    const end = new Date(this.availability.endDateTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }
}