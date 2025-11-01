import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recommendation } from '../../../models/recommendation.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recommendations-list',
  standalone: false,
  templateUrl: './recommendations-list.component.html',
  styleUrl: './recommendations-list.component.scss'
})
export class RecommendationsListComponent implements OnInit {
  recommendations: Recommendation[] = [];
  loading = false;
  currentUserId: number | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || null;
    if (this.currentUserId) {
      this.loadRecommendations();
    }
  }

  loadRecommendations(): void {
    if (!this.currentUserId) return;
    this.loading = true;
    this.userService.getRecommendations(this.currentUserId).subscribe({
      next: (data) => {
        this.recommendations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
        this.loading = false;
      }
    });
  }

  viewRecommendation(recommendation: Recommendation): void {
    // For now, just log the recommendation. Could open a modal or navigate to detail view
    console.log('Viewing recommendation:', recommendation);
  }

  editRecommendation(recommendation: Recommendation): void {
    this.router.navigate(['/recommendations/edit', recommendation.id]);
  }

  deleteRecommendation(recommendation: Recommendation): void {
    if (!this.currentUserId || !recommendation.id) return;
    if (confirm('Are you sure you want to delete this recommendation?')) {
      this.userService.deleteRecommendation(this.currentUserId, recommendation.id).subscribe({
        next: () => {
          this.loadRecommendations(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting recommendation:', error);
        }
      });
    }
  }

  createRecommendation(): void {
    this.router.navigate(['/recommendations/create']);
  }
}
