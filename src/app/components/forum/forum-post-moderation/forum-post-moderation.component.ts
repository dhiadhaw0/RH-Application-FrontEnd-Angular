import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumPost } from '../../../models/forum-post.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-post-moderation',
  templateUrl: './forum-post-moderation.component.html',
  styleUrl: './forum-post-moderation.component.scss'
})
export class ForumPostModerationComponent implements OnInit {
  @Input() post: ForumPost | null = null;
  @Input() currentUser: User | null = null;
  @Output() postModerated = new EventEmitter<ForumPost>();
  @Output() moderationCancelled = new EventEmitter<void>();

  postId: number = 0;
  moderationForm: FormGroup;
  submitting = false;
  error: string | null = null;
  loading = true;

  // Moderation actions
  moderationActions = [
    { value: 'delete', label: 'Supprimer le post', icon: 'fas fa-trash', color: 'danger' },
    { value: 'hide', label: 'Masquer le post', icon: 'fas fa-eye-slash', color: 'warning' },
    { value: 'lock', label: 'Verrouiller les réponses', icon: 'fas fa-lock', color: 'secondary' },
    { value: 'pin', label: 'Épingler le post', icon: 'fas fa-thumbtack', color: 'info' },
    { value: 'move', label: 'Déplacer vers une autre discussion', icon: 'fas fa-arrows-alt', color: 'primary' },
    { value: 'warn', label: 'Avertir l\'auteur', icon: 'fas fa-exclamation-triangle', color: 'warning' },
    { value: 'ban', label: 'Bannir l\'auteur', icon: 'fas fa-ban', color: 'danger' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.moderationForm = this.fb.group({
      action: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      duration: [''],
      notifyUser: [true],
      privateNote: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['postId'];
      if (this.postId && !this.post) {
        this.loadPost();
      } else if (this.post) {
        this.loading = false;
      }
    });
  }

  loadPost(): void {
    this.loading = true;
    // This would typically load the post from the service
    // For now, we'll assume the post is passed as input
    this.loading = false;
  }

  onActionChange(): void {
    const action = this.moderationForm.get('action')?.value;
    if (action === 'ban' || action === 'warn') {
      this.moderationForm.get('duration')?.setValidators([Validators.required]);
    } else {
      this.moderationForm.get('duration')?.clearValidators();
    }
    this.moderationForm.get('duration')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.moderationForm.valid && this.post) {
      this.submitting = true;
      const formValue = this.moderationForm.value;

      // Here you would call the appropriate moderation service method
      // For now, we'll simulate the moderation action
      this.performModerationAction(formValue);
    } else {
      this.markFormGroupTouched();
    }
  }

  private performModerationAction(actionData: any): void {
    // Simulate API call - in real implementation, this would call the forum service
    setTimeout(() => {
      // For now, just emit the post as-is since the model doesn't have moderation fields
      // In a real implementation, the backend would handle the moderation and return updated data
      this.submitting = false;
      this.postModerated.emit(this.post!);

      // Optionally navigate back
      this.router.navigate(['/forum/moderation/dashboard']);
    }, 1000);
  }

  cancel(): void {
    this.moderationCancelled.emit();
    this.router.navigate(['/forum/moderation/dashboard']);
  }

  getActionColor(action: string): string {
    const actionObj = this.moderationActions.find(a => a.value === action);
    return actionObj ? actionObj.color : 'secondary';
  }

  getActionIcon(action: string): string {
    const actionObj = this.moderationActions.find(a => a.value === action);
    return actionObj ? actionObj.icon : 'fas fa-cog';
  }

  getActionDescription(action: string): string {
    const descriptions: { [key: string]: string } = {
      'delete': 'Supprimer définitivement le post',
      'hide': 'Masquer le post sans le supprimer',
      'lock': 'Empêcher les nouvelles réponses',
      'pin': 'Épingler le post en haut de la discussion',
      'move': 'Déplacer vers une autre discussion',
      'warn': 'Avertir l\'auteur du post',
      'ban': 'Bannir l\'auteur du forum'
    };
    return descriptions[action] || 'Action de modération';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.moderationForm.controls).forEach(key => {
      const control = this.moderationForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.moderationForm.get(fieldName);
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
    const control = this.moderationForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
