import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../services/mentorship.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-mentor-search',
  templateUrl: './mentor-search.component.html',
  styleUrls: ['./mentor-search.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorSearchComponent {
  searchCriteria = {
    expertise: '',
    language: ''
  };
  mentors: User[] = [];
  loading = false;
  hasSearched = false;

  constructor(private mentorshipService: MentorshipService) {}

  searchMentors(): void {
    if (!this.searchCriteria.expertise.trim() && !this.searchCriteria.language.trim()) {
      alert('Veuillez saisir au moins un critère de recherche.');
      return;
    }

    this.loading = true;
    this.hasSearched = true;

    this.mentorshipService.searchMentors(
      this.searchCriteria.expertise || null,
      this.searchCriteria.language || null
    ).subscribe({
      next: (mentors) => {
        this.mentors = mentors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching mentors:', error);
        this.loading = false;
        // Load mock data if API fails
        this.loadMockSearchResults();
      }
    });
  }

  private loadMockSearchResults(): void {
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
      }
    ];
  }

  clearSearch(): void {
    this.searchCriteria = { expertise: '', language: '' };
    this.mentors = [];
    this.hasSearched = false;
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