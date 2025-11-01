import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recommendation, RecommendationType } from '../../../models/recommendation.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recommendation-create',
  standalone: false,
  templateUrl: './recommendation-create.component.html',
  styleUrl: './recommendation-create.component.scss'
})
export class RecommendationCreateComponent implements OnInit {
  recommendationForm: FormGroup;
  loading = false;
  currentUserId: number | null = null;
  recommendationTypes = Object.values(RecommendationType);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
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
  }

  onSubmit(): void {
    if (this.recommendationForm.valid && this.currentUserId) {
      this.loading = true;
      const formValue = this.recommendationForm.value;

      const recommendationData: Partial<Recommendation> = {
        comment: formValue.comment,
        type: formValue.type
      };

      this.userService.createRecommendation(this.currentUserId, recommendationData).subscribe({
        next: (recommendation) => {
          this.loading = false;
          this.router.navigate(['/recommendations']);
        },
        error: (error) => {
          console.error('Error creating recommendation:', error);
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
