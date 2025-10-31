import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillCreditsMarketplaceService } from '../../../services/skill-credits-marketplace.service';
import { AuthService } from '../../../services/auth.service';
import { OfferType, CreateOfferRequest } from '../../../models/skill-credits-marketplace.model';

@Component({
  selector: 'app-marketplace-create-offer',
  standalone: false,
  templateUrl: './marketplace-create-offer.component.html',
  styleUrl: './marketplace-create-offer.component.scss'
})
export class MarketplaceCreateOfferComponent implements OnInit {
  offerForm: FormGroup;
  loading = false;
  submitting = false;

  offerTypes = [
    { value: 'MENTORSHIP_SESSION', label: 'Session de Mentorat' },
    { value: 'FORMATION_ACCESS', label: 'Accès Formation' },
    { value: 'SKILL_SHARING', label: 'Partage de Compétences' },
    { value: 'CONSULTATION', label: 'Consultation' },
    { value: 'CUSTOM_SERVICE', label: 'Service Personnalisé' }
  ];

  constructor(
    private fb: FormBuilder,
    private marketplaceService: SkillCreditsMarketplaceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      offerType: ['', Validators.required],
      creditsRequired: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      maxParticipants: [1, [Validators.min(1), Validators.max(50)]],
      durationHours: ['', Validators.min(0.5)],
      skills: this.fb.array([]),
      requirements: this.fb.array([]),
      tags: this.fb.array([]),
      expiresAt: ['']
    });
  }

  ngOnInit(): void {
    // Add at least one skill and requirement
    this.addSkill();
    this.addRequirement();
    this.addTag();
  }

  get skills(): FormArray {
    return this.offerForm.get('skills') as FormArray;
  }

  get requirements(): FormArray {
    return this.offerForm.get('requirements') as FormArray;
  }

  get tags(): FormArray {
    return this.offerForm.get('tags') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  addRequirement(): void {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  addTag(): void {
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    if (this.offerForm.valid) {
      this.submitting = true;

      const user = this.authService.getCurrentUser();
      if (!user) {
        alert('Vous devez être connecté pour créer une offre.');
        this.submitting = false;
        return;
      }

      const formValue = this.offerForm.value;
      const offerRequest: CreateOfferRequest = {
        title: formValue.title,
        description: formValue.description,
        offerType: formValue.offerType,
        creditsRequired: formValue.creditsRequired,
        maxParticipants: formValue.maxParticipants || 1,
        durationHours: formValue.durationHours || undefined,
        skills: formValue.skills.filter((skill: string) => skill.trim()),
        requirements: formValue.requirements.filter((req: string) => req.trim()),
        tags: formValue.tags.filter((tag: string) => tag.trim()),
        expiresAt: formValue.expiresAt || undefined
      };

      this.marketplaceService.createOffer(offerRequest).subscribe({
        next: (offer) => {
          alert('Offre créée avec succès !');
          this.router.navigate(['/marketplace/dashboard']);
        },
        error: (error) => {
          console.error('Error creating offer:', error);
          alert('Erreur lors de la création de l\'offre. Veuillez réessayer.');
          this.submitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.offerForm.controls).forEach(key => {
        this.offerForm.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/marketplace/dashboard']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.offerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.offerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['maxlength']) {
        return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      }
      if (field.errors['min']) {
        return `Valeur minimum: ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `Valeur maximum: ${field.errors['max'].max}`;
      }
    }
    return '';
  }
}
