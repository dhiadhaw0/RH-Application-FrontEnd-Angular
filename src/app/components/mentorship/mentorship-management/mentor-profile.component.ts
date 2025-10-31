import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorProfileComponent implements OnInit {
  mentor: User | null = null;
  loading = false;
  mentorId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private mentorshipService: MentorshipService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.mentorId = +params['id'];
      this.loadMentorProfile();
    });
  }

  loadMentorProfile(): void {
    this.loading = true;
    this.mentorshipService.getMentorProfile(this.mentorId).subscribe({
      next: (mentor) => {
        this.mentor = mentor;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading mentor profile:', error);
        this.loading = false;
        // Load mock data if API fails
        this.loadMockMentor();
      }
    });
  }

  private loadMockMentor(): void {
    this.mentor = {
      id: this.mentorId,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-03-15'),
      createdAt: new Date(),
      isMentor: true,
      mentorBio: 'Expert en développement web avec plus de 10 ans d\'expérience. Spécialisé dans les technologies JavaScript modernes, React, Node.js et les architectures microservices. Passionné par le partage des connaissances et l\'accompagnement des développeurs en herbe.',
      mentorExpertise: 'Développement Web, JavaScript, React, Node.js, Architecture',
      languages: 'Français, Anglais',
      expertise: 'Full Stack Development',
      availability: 'Lundi au Vendredi, 9h-17h',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      mentorSince: new Date('2018-01-15'),
      profilePictureUrl: '',
      role: 'USER' as any,
      banned: false,
      isModerator: false
    };
  }

  requestMentorship(): void {
    if (this.mentor) {
      // Navigate to request form with mentor pre-selected
      console.log('Request mentorship from:', this.mentor.id);
    }
  }

  viewAvailability(): void {
    if (this.mentor) {
      // Navigate to mentor availability
      console.log('View availability for:', this.mentor.id);
    }
  }

  contactMentor(): void {
    if (this.mentor) {
      // Open contact modal or navigate to contact form
      console.log('Contact mentor:', this.mentor.id);
    }
  }
}