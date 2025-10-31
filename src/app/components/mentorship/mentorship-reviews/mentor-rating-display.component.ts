import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorshipReviewService } from '../../../services/mentorship-review.service';

@Component({
  selector: 'app-mentor-rating-display',
  templateUrl: './mentor-rating-display.component.html',
  styleUrls: ['./mentor-rating-display.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MentorRatingDisplayComponent implements OnInit {
  @Input() mentorId: number = 0;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  averageRating: number = 0;
  totalReviews: number = 0;
  loading = false;

  constructor(private reviewService: MentorshipReviewService) {}

  ngOnInit(): void {
    if (this.mentorId) {
      this.loadMentorRating();
    }
  }

  ngOnChanges(): void {
    if (this.mentorId) {
      this.loadMentorRating();
    }
  }

  loadMentorRating(): void {
    this.loading = true;
    this.reviewService.getReviewsForMentor(this.mentorId).subscribe({
      next: (reviews) => {
        this.totalReviews = reviews.length;
        if (reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          this.averageRating = Math.round((sum / reviews.length) * 10) / 10;
        } else {
          this.averageRating = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading mentor rating:', error);
        this.averageRating = 0;
        this.totalReviews = 0;
        this.loading = false;
      }
    });
  }

  getRatingStars(): string[] {
    const fullStars = Math.floor(this.averageRating);
    const hasHalfStar = this.averageRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push('☆');
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }

    return stars;
  }

  getRatingColor(): string {
    if (this.averageRating >= 4.5) return '#28a745';
    if (this.averageRating >= 4.0) return '#20c997';
    if (this.averageRating >= 3.5) return '#ffc107';
    if (this.averageRating >= 3.0) return '#fd7e14';
    return '#dc3545';
  }

  getRatingText(): string {
    if (this.averageRating >= 4.5) return 'Excellent';
    if (this.averageRating >= 4.0) return 'Très bien';
    if (this.averageRating >= 3.5) return 'Bien';
    if (this.averageRating >= 3.0) return 'Correct';
    if (this.averageRating >= 2.0) return 'Moyen';
    return 'À améliorer';
  }
}