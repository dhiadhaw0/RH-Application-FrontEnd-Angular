import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ForumService } from '../../../services/forum.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-post-create',
  templateUrl: './forum-post-create.component.html',
  styleUrl: './forum-post-create.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForumPostCreateComponent implements OnInit {
  @Output() postCreated = new EventEmitter<any>();

  threadId: number = 0;
  postForm: FormGroup;
  submitting = false;
  error: string | null = null;
  currentUser: User | null = null; // This should come from auth service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private forumService: ForumService,
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]],
      anonymous: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.threadId = +params['threadId'];
    });

    // Get current user from auth service
    // TODO: Implement auth service integration
    // this.authService.currentUser$.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  onSubmit(): void {
    if (this.postForm.valid && this.currentUser && this.threadId) {
      this.submitting = true;
      const formValue = this.postForm.value;

      this.forumService.createPost(
        this.threadId,
        this.currentUser.id,
        formValue.content,
        formValue.anonymous
      ).subscribe({
        next: (post) => {
          this.submitting = false;
          this.postCreated.emit(post);
          this.postForm.reset();
          // Optionally navigate back or show success message
        },
        error: (err) => {
          this.error = 'Erreur lors de la création du post';
          this.submitting = false;
          console.error('Error creating post:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    this.postForm.reset();
    // Optionally emit cancel event or navigate back
  }

  private markFormGroupTouched(): void {
    Object.keys(this.postForm.controls).forEach(key => {
      const control = this.postForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.postForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.postForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
