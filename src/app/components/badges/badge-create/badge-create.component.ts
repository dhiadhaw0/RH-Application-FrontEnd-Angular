import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { BadgeService } from '../../../services/badge.service';
import { Badge } from '../../../models/badge.model';

@Component({
  selector: 'app-badge-create',
  templateUrl: './badge-create.component.html',
  styleUrls: ['./badge-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent]
})
export class BadgeCreateComponent implements OnInit {
  badgeForm: FormGroup;
  selectedIcon = 'fas fa-medal';
  requirements: string[] = [''];
  isSubmitting = false;

  availableIcons = [
    'fas fa-medal',
    'fas fa-trophy',
    'fas fa-star',
    'fas fa-crown',
    'fas fa-award',
    'fas fa-certificate',
    'fas fa-shield-alt',
    'fas fa-badge',
    'fas fa-ribbon',
    'fas fa-gem',
    'fas fa-diamond',
    'fas fa-heart',
    'fas fa-lightbulb',
    'fas fa-rocket',
    'fas fa-users',
    'fas fa-handshake'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private badgeService: BadgeService
  ) {
    this.badgeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {}

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
  }

  addRequirement(): void {
    this.requirements.push('');
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.splice(index, 1);
    }
  }

  updateRequirement(index: number, value: string): void {
    this.requirements[index] = value;
  }

  getValidRequirements(): string[] {
    return this.requirements.filter(req => req.trim().length > 0);
  }

  getBadgePreview(): any {
    return {
      nom: this.badgeForm.get('nom')?.value || 'Nouveau Badge',
      description: this.badgeForm.get('description')?.value || 'Description du badge...',
      icon: this.selectedIcon,
      requirements: this.getValidRequirements()
    };
  }

  onSubmit(): void {
    if (this.badgeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const badgeData: Partial<Badge> = {
        nom: this.badgeForm.value.nom,
        description: this.badgeForm.value.description
        // Note: Icon and requirements would be stored in a separate table or JSON field
      };

      this.badgeService.createBadge(badgeData).subscribe({
        next: (createdBadge) => {
          this.router.navigate(['/badges', createdBadge.id]);
        },
        error: (error) => {
          console.error('Error creating badge:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.badgeForm.controls).forEach(key => {
        this.badgeForm.get(key)?.markAsTouched();
      });
    }
  }

  getCharacterCount(fieldName: string): number {
    const value = this.badgeForm.get(fieldName)?.value || '';
    return value.length;
  }

  getMaxLength(fieldName: string): number {
    const field = this.badgeForm.get(fieldName);
    const maxLengthValidator = field?.validator?.({} as any)?.maxLength;
    return maxLengthValidator?.requiredLength || 0;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.badgeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.badgeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['maxlength']) {
        return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }
}