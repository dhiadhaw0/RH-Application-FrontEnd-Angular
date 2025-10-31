import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer, StatutOffre, WorkflowStatus } from '../../../models/job-offer.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-job-offer-create',
  templateUrl: './job-offer-create.component.html',
  styleUrls: ['./job-offer-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent]
})
export class JobOfferCreateComponent implements OnInit {
  createForm: FormGroup;
  loading = false;
  submitting = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jobOfferService: JobOfferService,
    private userService: UserService
  ) {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      salaryMin: [null, [Validators.min(0)]],
      salaryMax: [null, [Validators.min(0)]],
      remote: [false],
      expiresAt: [null],
      requirementsHardSkills: this.fb.array([]),
      requirementsSoftSkills: this.fb.array([])
    }, { validators: this.salaryValidator });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    this.currentUser = null;
  }

  get hardSkills(): FormArray {
    return this.createForm.get('requirementsHardSkills') as FormArray;
  }

  get softSkills(): FormArray {
    return this.createForm.get('requirementsSoftSkills') as FormArray;
  }

  addHardSkill(): void {
    this.hardSkills.push(this.fb.control('', [Validators.required, Validators.minLength(2)]));
  }

  removeHardSkill(index: number): void {
    this.hardSkills.removeAt(index);
  }

  addSoftSkill(): void {
    this.softSkills.push(this.fb.control('', [Validators.required, Validators.minLength(2)]));
  }

  removeSoftSkill(index: number): void {
    this.softSkills.removeAt(index);
  }

  salaryValidator(group: FormGroup): any {
    const min = group.get('salaryMin')?.value;
    const max = group.get('salaryMax')?.value;

    if (min && max && min >= max) {
      return { salaryInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.createForm.valid && !this.submitting) {
      this.submitting = true;

      const formValue = this.createForm.value;
      const jobOffer: Partial<JobOffer> = {
        title: formValue.title,
        description: formValue.description,
        requirementsHardSkills: formValue.requirementsHardSkills.filter((skill: string) => skill.trim()),
        requirementsSoftSkills: formValue.requirementsSoftSkills.filter((skill: string) => skill.trim()),
        salaryMin: formValue.salaryMin,
        salaryMax: formValue.salaryMax,
        remote: formValue.remote,
        expiresAt: formValue.expiresAt,
        status: StatutOffre.BROUILLON,
        workflowStatus: WorkflowStatus.REDACTION,
        user: this.currentUser?.id || null,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (this.currentUser?.id) {
        this.jobOfferService.createJobOffer(this.currentUser.id, jobOffer).subscribe({
          next: (createdOffer) => {
            this.router.navigate(['/job-offers', createdOffer.idJobOffer], {
              queryParams: { created: 'true' }
            });
          },
          error: (error) => {
            console.error('Error creating job offer:', error);
            this.submitting = false;
          },
          complete: () => {
            this.submitting = false;
          }
        });
      } else {
        console.error('User not logged in');
        this.submitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.createForm.controls).forEach(key => {
      const control = this.createForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/job-offers']);
  }

  getFieldError(fieldName: string): string {
    const field = this.createForm.get(fieldName);
    if (field?.errors && field.touched) {
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
        return 'La valeur doit être positive';
      }
    }
    return '';
  }

  getFormError(): string {
    if (this.createForm.errors?.['salaryInvalid']) {
      return 'Le salaire minimum doit être inférieur au salaire maximum';
    }
    return '';
  }
}