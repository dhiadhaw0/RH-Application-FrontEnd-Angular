import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorshipReviewService } from '../../../services/mentorship-review.service';

@Component({
  selector: 'app-mentorship-review-form',
  templateUrl: './mentorship-review-form.component.html',
  styleUrls: ['./mentorship-review-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MentorshipReviewFormComponent implements OnInit {
  sessionId: number = 0;
  reviewData = {
    rating: 5,
    comment: ''
  };
  loading = false;
  submitting = false;
  userId = 1; // TODO: Get from authentication service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: MentorshipReviewService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = +params['id'];
      this.checkIfAlreadyReviewed();
    });
  }

  checkIfAlreadyReviewed(): void {
    this.loading = true;
    this.reviewService.hasUserReviewedSession(this.sessionId, this.userId).subscribe({
      next: (hasReviewed) => {
        this.loading = false;
        if (hasReviewed) {
          alert('Vous avez déjà laissé un avis pour cette session.');
          this.router.navigate(['/mentorship/sessions']);
        }
      },
      error: (error) => {
        console.error('Error checking review status:', error);
        this.loading = false;
      }
    });
  }

  setRating(rating: number): void {
    this.reviewData.rating = rating;
  }

  getRatingStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  onSubmit(): void {
    if (!this.reviewData.comment.trim()) {
      alert('Veuillez ajouter un commentaire.');
      return;
    }

    this.submitting = true;
    this.reviewService.submitReview(
      this.sessionId,
      this.userId,
      this.reviewData.rating,
      this.reviewData.comment
    ).subscribe({
      next: (review) => {
        this.submitting = false;
        alert('Avis soumis avec succès!');
        this.router.navigate(['/mentorship/reviews']);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.submitting = false;
        alert('Erreur lors de la soumission de l\'avis.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mentorship/sessions']);
  }
}