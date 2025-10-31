import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipReviewService } from '../../../services/mentorship-review.service';
import { MentorshipReview } from '../../../models/mentorship-review.model';

@Component({
  selector: 'app-mentorship-review-list',
  templateUrl: './mentorship-review-list.component.html',
  styleUrls: ['./mentorship-review-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipReviewListComponent implements OnInit {
  reviews: MentorshipReview[] = [];
  loading = false;
  mentorId: number | null = null; // Filter by mentor
  userId: number | null = null; // Filter by user

  constructor(private reviewService: MentorshipReviewService) {}

  ngOnInit(): void {
    // TODO: Get filter parameters from route or query params
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;

    // Load reviews based on filters
    if (this.mentorId) {
      this.reviewService.getReviewsForMentor(this.mentorId).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading mentor reviews:', error);
          this.loading = false;
          this.loadMockReviews();
        }
      });
    } else if (this.userId) {
      this.reviewService.getReviewsByUser(this.userId).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading user reviews:', error);
          this.loading = false;
          this.loadMockReviews();
        }
      });
    } else {
      // Load all reviews - this might need a new service method
      this.loadMockReviews();
    }
  }

  private loadMockReviews(): void {
    this.reviews = [
      {
        id: 1,
        session: {
          id: 1,
          mentorshipRequest: {
            id: 1,
            mentee: { id: 2, email: '', firstName: 'Alice', lastName: 'Dubois', dateOfBirth: new Date(), createdAt: new Date(), isMentor: false, banned: false, isModerator: false, role: 'USER' as any },
            mentor: { id: 1, email: '', firstName: 'John', lastName: 'Doe', dateOfBirth: new Date(), createdAt: new Date(), isMentor: true, banned: false, isModerator: false, role: 'USER' as any },
            topic: 'React Development',
            description: '',
            requestedAt: new Date(),
            status: 'COMPLETED' as any,
            urgency: 'MEDIUM' as any
          },
          scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          durationMinutes: 60,
          location: 'En ligne',
          agenda: '',
          status: 'COMPLETED' as any
        },
        reviewer: {
          id: 2,
          email: 'alice@example.com',
          firstName: 'Alice',
          lastName: 'Dubois',
          dateOfBirth: new Date('1995-05-15'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        rating: 5,
        comment: 'Excellente session ! John est très pédagogue et a su m\'expliquer les concepts complexes de React de manière claire. Je recommande vivement.',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        session: {
          id: 2,
          mentorshipRequest: {
            id: 2,
            mentee: { id: 3, email: '', firstName: 'Bob', lastName: 'Martin', dateOfBirth: new Date(), createdAt: new Date(), isMentor: false, banned: false, isModerator: false, role: 'USER' as any },
            mentor: { id: 1, email: '', firstName: 'John', lastName: 'Doe', dateOfBirth: new Date(), createdAt: new Date(), isMentor: true, banned: false, isModerator: false, role: 'USER' as any },
            topic: 'Data Science',
            description: '',
            requestedAt: new Date(),
            status: 'COMPLETED' as any,
            urgency: 'HIGH' as any
          },
          scheduledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          durationMinutes: 90,
          location: 'En ligne',
          agenda: '',
          status: 'COMPLETED' as any
        },
        reviewer: {
          id: 3,
          email: 'bob@example.com',
          firstName: 'Bob',
          lastName: 'Martin',
          dateOfBirth: new Date('1990-08-20'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        rating: 4,
        comment: 'Très bonne session. Quelques conseils pratiques très utiles pour mon projet de data science. Le mentor connaît bien son sujet.',
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
      }
    ];
    this.loading = false;
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '★' : '☆');
    }
    return stars;
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  getRatingDistribution(): { rating: number; count: number; percentage: number }[] {
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: this.reviews.filter(review => review.rating === rating).length,
      percentage: 0
    }));

    distribution.forEach(item => {
      item.percentage = this.reviews.length > 0 ? (item.count / this.reviews.length) * 100 : 0;
    });

    return distribution.reverse(); // Show 5 stars first
  }
}