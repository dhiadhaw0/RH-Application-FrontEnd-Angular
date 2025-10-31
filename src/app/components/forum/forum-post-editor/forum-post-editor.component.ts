import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumPost } from '../../../models/forum-post.model';

@Component({
  selector: 'app-forum-post-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forum-post-editor.component.html',
  styleUrl: './forum-post-editor.component.scss'
})
export class ForumPostEditorComponent implements OnInit {
  @Input() post: ForumPost | null = null;
  @Output() postUpdated = new EventEmitter<ForumPost>();
  @Output() editCancelled = new EventEmitter<void>();

  editForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.editForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]],
      anonymous: [false]
    });
  }

  ngOnInit(): void {
    if (this.post) {
      this.editForm.patchValue({
        content: this.post.content,
        anonymous: this.post.anonymous
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.post) {
      this.submitting = true;
      const formValue = this.editForm.value;

      this.forumService.updatePost(this.post.id, {
        content: formValue.content,
        anonymous: formValue.anonymous
      }).subscribe({
        next: (updatedPost) => {
          this.submitting = false;
          this.postUpdated.emit(updatedPost);
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour du post';
          this.submitting = false;
          console.error('Error updating post:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    this.editCancelled.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.editForm.get(fieldName);
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
    const control = this.editForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
