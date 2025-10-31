import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forum-report-form.component.html',
  styleUrl: './forum-report-form.component.scss'
})
export class ForumReportFormComponent implements OnInit {
  @Input() reportedPostId: number | null = null;
  @Input() reportedThreadId: number | null = null;
  @Input() currentUser: User | null = null;
  @Output() reportSubmitted = new EventEmitter<any>();
  @Output() formCancelled = new EventEmitter<void>();

  reportForm: FormGroup;
  submitting = false;
  error: string | null = null;

  reportReasons = [
    { value: 'spam', label: 'Spam ou publicité non sollicitée', icon: 'fas fa-ad' },
    { value: 'harassment', label: 'Harcèlement ou intimidation', icon: 'fas fa-angry' },
    { value: 'inappropriate', label: 'Contenu inapproprié ou offensant', icon: 'fas fa-exclamation-triangle' },
    { value: 'misinformation', label: 'Désinformation ou fausses informations', icon: 'fas fa-info-circle' },
    { value: 'copyright', label: 'Violation des droits d\'auteur', icon: 'fas fa-copyright' },
    { value: 'offtopic', label: 'Hors sujet ou contenu inapproprié', icon: 'fas fa-random' },
    { value: 'duplicate', label: 'Contenu dupliqué', icon: 'fas fa-copy' },
    { value: 'other', label: 'Autre raison', icon: 'fas fa-question-circle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.reportForm = this.fb.group({
      reason: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      anonymous: [false],
      contactModerator: [false]
    });
  }

  ngOnInit(): void {
    // Check route parameters for post/thread IDs
    this.route.params.subscribe(params => {
      if (params['postId']) {
        this.reportedPostId = +params['postId'];
      }
      if (params['threadId']) {
        this.reportedThreadId = +params['threadId'];
      }
    });
  }

  onReasonChange(): void {
    // Could add dynamic validation based on reason
  }

  onSubmit(): void {
    if (this.reportForm.valid && this.currentUser && (this.reportedPostId || this.reportedThreadId)) {
      this.submitting = true;
      const formValue = this.reportForm.value;

      const reportData = {
        reporterId: this.currentUser.id,
        reportedPostId: this.reportedPostId,
        reportedThreadId: this.reportedThreadId,
        reason: formValue.reason,
        description: formValue.description,
        anonymous: formValue.anonymous,
        contactModerator: formValue.contactModerator
      };

      // Use the actual service method
      if (this.reportedPostId) {
        // Report a post
        // this.forumReportService.reportPost(reportData.reporterId, this.reportedPostId, formValue.reason).subscribe({
        //   next: (report) => {
        //     this.submitting = false;
        //     this.reportSubmitted.emit(report);
        //     this.router.navigate(['/forum']);
        //   },
        //   error: (err) => {
        //     this.error = 'Erreur lors de la soumission du signalement';
        //     this.submitting = false;
        //     console.error('Error submitting report:', err);
        //   }
        // });
      } else if (this.reportedThreadId) {
        // Report a thread
        // this.forumReportService.reportThread(reportData.reporterId, this.reportedThreadId, formValue.reason).subscribe({
        //   next: (report) => {
        //     this.submitting = false;
        //     this.reportSubmitted.emit(report);
        //     this.router.navigate(['/forum']);
        //   },
        //   error: (err) => {
        //     this.error = 'Erreur lors de la soumission du signalement';
        //     this.submitting = false;
        //     console.error('Error submitting report:', err);
        //   }
        // });
      }

      // For now, simulate the API call
      setTimeout(() => {
        this.submitting = false;
        this.reportSubmitted.emit(reportData);
        // Navigate back or show success message
        this.router.navigate(['/forum']);
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    this.formCancelled.emit();
    this.router.navigate(['/forum']);
  }

  getReasonIcon(reason: string): string {
    const reasonObj = this.reportReasons.find(r => r.value === reason);
    return reasonObj ? reasonObj.icon : 'fas fa-question-circle';
  }

  getReasonLabel(reason: string): string {
    const reasonObj = this.reportReasons.find(r => r.value === reason);
    return reasonObj ? reasonObj.label : 'Raison inconnue';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reportForm.controls).forEach(key => {
      const control = this.reportForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.reportForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['maxlength']) {
        return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.reportForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
