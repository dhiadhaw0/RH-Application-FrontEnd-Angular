import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recommendation, RecommendationType } from '../../../models/recommendation.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recommendation-edit',
  standalone: false,
  templateUrl: './recommendation-edit.component.html',
  styleUrl: './recommendation-edit.component.scss'
})
export class RecommendationEditComponent implements OnInit {
  recommendationForm: FormGroup;
  loading = false;
  currentUserId: number | null = null;
  recommendationId: number | null = null;
  recommendationTypes = Object.values(RecommendationType);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recommendationForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]],
      type: [RecommendationType.POSITIVE, Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || null;
    this.recommendationId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.recommendationId && this.currentUserId) {
      this.loadRecommendation();
    }
  }

  loadRecommendation(): void {
    if (!this.currentUserId || !this.recommendationId) return;
    this.loading = true;
    this.userService.getRecommendations(this.currentUserId).subscribe({
      next: (recommendations) => {
        const recommendation = recommendations.find(r => r.id === this.recommendationId);
        if (recommendation) {
          this.recommendationForm.patchValue({
            comment: recommendation.comment,
            type: recommendation.type
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recommendation:', error);
        this.loading = false;
        this.router.navigate(['/recommendations']);
      }
    });
  }

  onSubmit(): void {
    if (this.recommendationForm.valid && this.currentUserId && this.recommendationId) {
      this.loading = true;
      const formValue = this.recommendationForm.value;

      const recommendationData: Partial<Recommendation> = {
        comment: formValue.comment,
        type: formValue.type
      };

      this.userService.updateRecommendation(this.currentUserId, this.recommendationId, recommendationData).subscribe({
        next: (recommendation) => {
          this.loading = false;
          this.router.navigate(['/recommendations']);
        },
        error: (error) => {
          console.error('Error updating recommendation:', error);
          this.loading = false;
        }
      });
    } else {
      this.recommendationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/recommendations']);
  }

  get comment() {
    return this.recommendationForm.get('comment');
  }

  get type() {
    return this.recommendationForm.get('type');
  }
}
