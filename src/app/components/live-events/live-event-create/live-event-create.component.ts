import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LiveEventService } from '../../../services/live-event.service';
import { LiveEvent } from '../../../models/live-event.model';

@Component({
  selector: 'app-live-event-create',
  standalone: false,
  templateUrl: './live-event-create.component.html',
  styleUrl: './live-event-create.component.scss'
})
export class LiveEventCreateComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private liveEventService: LiveEventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      maxParticipants: [50, [Validators.required, Validators.min(1), Validators.max(1000)]],
      isRecording: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.submitting = true;
      const formValue = this.eventForm.value;

      const eventData: Partial<LiveEvent> = {
        title: formValue.title,
        description: formValue.description,
        startTime: new Date(formValue.startTime),
        endTime: new Date(formValue.endTime),
        maxParticipants: formValue.maxParticipants,
        isRecording: formValue.isRecording,
        status: 'scheduled'
      };

      this.liveEventService.createEvent(eventData).subscribe({
        next: (createdEvent) => {
          // Create discussion thread for the event
          this.liveEventService.createEventDiscussionThread(createdEvent.id, createdEvent.title, 1).subscribe({
            next: () => {
              console.log('Discussion thread created for event');
            },
            error: (error) => {
              console.error('Error creating discussion thread:', error);
              // Don't fail the event creation if forum integration fails
            }
          });

          this.submitting = false;
          this.router.navigate(['/live-events', createdEvent.id]);
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.eventForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${control.errors?.['max'].max}`;
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(['/live-events']);
  }
}
