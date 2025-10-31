import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorAvailabilityService } from '../../../services/mentor-availability.service';
import { MentorAvailability } from '../../../models/mentor-availability.model';

@Component({
  selector: 'app-mentor-availability-add',
  templateUrl: './mentor-availability-add.component.html',
  styleUrls: ['./mentor-availability-add.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorAvailabilityAddComponent {
  availability: Partial<MentorAvailability> = {
    startDateTime: '',
    endDateTime: ''
  };
  loading = false;
  mentorId = 1; // TODO: Get from authentication service

  constructor(
    private availabilityService: MentorAvailabilityService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.availability.startDateTime || !this.availability.endDateTime) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const startDate = new Date(this.availability.startDateTime);
    const endDate = new Date(this.availability.endDateTime);

    if (startDate >= endDate) {
      alert('La date de fin doit être après la date de début.');
      return;
    }

    this.loading = true;
    this.availabilityService.addAvailability(
      this.mentorId,
      this.availability.startDateTime as string,
      this.availability.endDateTime as string
    ).subscribe({
      next: (result) => {
        this.loading = false;
        alert('Créneau ajouté avec succès!');
        this.router.navigate(['/mentor-availability']);
      },
      error: (error) => {
        console.error('Error adding availability:', error);
        this.loading = false;
        alert('Erreur lors de l\'ajout du créneau.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mentor-availability']);
  }
}