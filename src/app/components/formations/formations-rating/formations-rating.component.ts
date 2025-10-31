import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormationService } from '../../../services/formation.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formation-rating',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formations-rating.component.html',
  styleUrl: './formations-rating.component.scss'
})
export class FormationRatingComponent {
  @Input() formationId: number = 0;
  @Input() currentRating: number = 0;
  @Input() showSubmitButton: boolean = true;
  @Output() ratingSubmitted = new EventEmitter<number>();

  userRating: number = 0;
  isSubmitting = false;
  hoverRating: number = 0;

  constructor(private formationService: FormationService) {}

  setRating(rating: number): void {
    this.userRating = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  submitRating(): void {
    if (this.userRating < 1 || this.userRating > 5 || this.isSubmitting) return;

    this.isSubmitting = true;

    this.formationService.submitRating(this.formationId, this.userRating).subscribe({
      next: (response) => {
        console.log('Note soumise avec succès:', response);
        this.ratingSubmitted.emit(this.userRating);
        this.userRating = 0;
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erreur lors de la soumission de la note:', error);
        this.isSubmitting = false;
      }
    });
  }

  getRatingDisplay(): number {
    return this.hoverRating || this.userRating || this.currentRating;
  }

  getStars(): string {
    const rating = this.getRatingDisplay();
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
           (hasHalfStar ? '☆' : '') +
           '☆'.repeat(emptyStars);
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isStarActive(star: number): boolean {
    return star <= this.getRatingDisplay();
  }
}
