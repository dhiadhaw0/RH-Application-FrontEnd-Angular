import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumThread } from '../../../models/forum-thread.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-thread-moderation',
  templateUrl: './forum-thread-moderation.component.html',
  styleUrl: './forum-thread-moderation.component.scss'
})
export class ForumThreadModerationComponent implements OnInit {
  threadId: number = 0;
  thread: ForumThread | null = null;
  currentUser: User | null = null;
  loading = true;
  error: string | null = null;
  moderationForm: FormGroup;
  submitting = false;

  moderationActions = [
    { value: 'none', label: 'Aucune action', color: 'secondary', icon: 'fas fa-check-circle' },
    { value: 'pin', label: 'Épingler la discussion', color: 'warning', icon: 'fas fa-thumbtack' },
    { value: 'unpin', label: 'Désépingler la discussion', color: 'secondary', icon: 'fas fa-thumbtack' },
    { value: 'close', label: 'Fermer la discussion', color: 'danger', icon: 'fas fa-lock' },
    { value: 'open', label: 'Rouvrir la discussion', color: 'success', icon: 'fas fa-unlock' },
    { value: 'delete', label: 'Supprimer la discussion', color: 'danger', icon: 'fas fa-trash' },
    { value: 'move', label: 'Déplacer vers une autre catégorie', color: 'info', icon: 'fas fa-arrows-alt' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.moderationForm = this.fb.group({
      action: ['none', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      moveToCategory: [''],
      notifyAuthor: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.threadId = +params['threadId'];
      if (this.threadId) {
        this.loadThread();
      }
    });
  }

  loadThread(): void {
    this.loading = true;
    // Simulate loading thread data
    setTimeout(() => {
      this.thread = this.generateMockThread();
      this.loading = false;
    }, 1000);
  }

  private generateMockThread(): ForumThread {
    return {
      id: this.threadId,
      title: 'Discussion problématique nécessitant modération',
      content: 'Contenu de la discussion qui nécessite une attention particulière de la part des modérateurs.',
      author: {
        id: 1,
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@example.com',
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        isMentor: false,
        banned: false,
        isModerator: false,
        role: 'USER' as any
      },
      category: {
        id: 1,
        name: 'General',
        allowAnonymous: false
      },
      createdAt: new Date(Date.now() - 3600000),
      isPinned: false,
      isClosed: false
    };
  }

  onActionChange(): void {
    const action = this.moderationForm.value.action;
    if (action === 'move') {
      this.moderationForm.get('moveToCategory')?.setValidators([Validators.required]);
    } else {
      this.moderationForm.get('moveToCategory')?.clearValidators();
    }
    this.moderationForm.get('moveToCategory')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.moderationForm.valid && this.thread) {
      this.submitting = true;
      const formValue = this.moderationForm.value;

      // Simulate moderation action
      setTimeout(() => {
        this.submitting = false;
        // Navigate back to moderation dashboard
        this.router.navigate(['/forum/moderation/dashboard']);
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  getActionColor(action: string): string {
    const actionObj = this.moderationActions.find(a => a.value === action);
    return actionObj ? actionObj.color : 'secondary';
  }

  getActionIcon(action: string): string {
    const actionObj = this.moderationActions.find(a => a.value === action);
    return actionObj ? actionObj.icon : 'fas fa-question-circle';
  }

  getActionLabel(action: string): string {
    const actionObj = this.moderationActions.find(a => a.value === action);
    return actionObj ? actionObj.label : 'Action inconnue';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/forum/moderation/dashboard']);
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
