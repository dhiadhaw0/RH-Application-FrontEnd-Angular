import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-mentor-list',
  templateUrl: './mentor-list.component.html',
  styleUrls: ['./mentor-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorListComponent implements OnInit {
  mentors: User[] = [];
  loading = false;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadMentors();
  }

  loadMentors(): void {
    this.loading = true;
    this.mentorshipService.listMentors().subscribe({
      next: (mentors) => {
        this.mentors = mentors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading mentors:', error);
        this.loading = false;
        // Load mock data if API fails
        this.loadMockMentors();
      }
    });
  }

  private loadMockMentors(): void {
    this.mentors = [
      {
        id: 1,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1985-03-15'),
        createdAt: new Date(),
        isMentor: true,
        mentorBio: 'Expert en développement web avec 10 ans d\'expérience',
        mentorExpertise: 'Développement Web, JavaScript, React',
        languages: 'Français, Anglais',
        role: 'USER' as any,
        banned: false,
        isModerator: false
      },
      {
        id: 2,
        email: 'sarah.wilson@example.com',
        firstName: 'Sarah',
        lastName: 'Wilson',
        dateOfBirth: new Date('1988-07-22'),
        createdAt: new Date(),
        isMentor: true,
        mentorBio: 'Data Scientist spécialisée en machine learning',
        mentorExpertise: 'Data Science, Python, Machine Learning',
        languages: 'Français, Anglais',
        role: 'USER' as any,
        banned: false,
        isModerator: false
      },
      {
        id: 3,
        email: 'marc.dupont@example.com',
        firstName: 'Marc',
        lastName: 'Dupont',
        dateOfBirth: new Date('1982-11-08'),
        createdAt: new Date(),
        isMentor: true,
        mentorBio: 'Architecte logiciel et expert en cybersécurité',
        mentorExpertise: 'Architecture, Cybersécurité, Java',
        languages: 'Français, Anglais, Allemand',
        role: 'USER' as any,
        banned: false,
        isModerator: false
      }
    ];
  }

  viewProfile(mentor: User): void {
    // Navigate to mentor profile
    console.log('View profile:', mentor.id);
  }

  contactMentor(mentor: User): void {
    // Navigate to request form or open contact modal
    console.log('Contact mentor:', mentor.id);
  }
}