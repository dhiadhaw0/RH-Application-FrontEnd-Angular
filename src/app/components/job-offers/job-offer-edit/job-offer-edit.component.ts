import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer, StatutOffre, WorkflowStatus } from '../../../models/job-offer.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-job-offer-edit',
  templateUrl: './job-offer-edit.component.html',
  styleUrls: ['./job-offer-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent]
})
export class JobOfferEditComponent implements OnInit {
  editForm: FormGroup;
  offer: JobOffer | null = null;
  loading = false;
  submitting = false;
  currentUser: User | null = null;
  isOwner = false;
  canEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
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
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOffer(+id);
    }
    this.loadCurrentUser();
  }

  loadOffer(id: number): void {
    this.loading = true;
    this.jobOfferService.getJobOfferById(id).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.populateForm();
        this.checkPermissions();
      },
      error: (error) => {
        console.error('Error loading job offer:', error);
        this.router.navigate(['/job-offers']);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    this.currentUser = null;
    this.checkPermissions();
  }

  populateForm(): void {
    if (!this.offer) return;

    this.editForm.patchValue({
      title: this.offer.title,
      description: this.offer.description,
      salaryMin: this.offer.salaryMin,
      salaryMax: this.offer.salaryMax,
      remote: this.offer.remote,
      expiresAt: this.offer.expiresAt ? new Date(this.offer.expiresAt).toISOString().slice(0, 16) : null
    });

    // Populate hard skills
    const hardSkillsArray = this.editForm.get('requirementsHardSkills') as FormArray;
    hardSkillsArray.clear();
    this.offer.requirementsHardSkills?.forEach(skill => {
      hardSkillsArray.push(this.fb.control(skill, [Validators.required, Validators.minLength(2)]));
    });

    // Populate soft skills
    const softSkillsArray = this.editForm.get('requirementsSoftSkills') as FormArray;
    softSkillsArray.clear();
    this.offer.requirementsSoftSkills?.forEach(skill => {
      softSkillsArray.push(this.fb.control(skill, [Validators.required, Validators.minLength(2)]));
    });
  }

  checkPermissions(): void {
    if (!this.offer || !this.currentUser) return;

    this.isOwner = this.offer.user === this.currentUser.id || this.offer.user === this.currentUser;
    this.canEdit = this.isOwner && this.offer.workflowStatus === 'REDACTION';

    if (!this.canEdit) {
      this.router.navigate(['/job-offers', this.offer.idJobOffer]);
    }
  }

  get hardSkills(): FormArray {
    return this.editForm.get('requirementsHardSkills') as FormArray;
  }

  get softSkills(): FormArray {
    return this.editForm.get('requirementsSoftSkills') as FormArray;
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
    if (this.editForm.valid && !this.submitting && this.offer) {
      this.submitting = true;

      const formValue = this.editForm.value;
      const updatedOffer: Partial<JobOffer> = {
        title: formValue.title,
        description: formValue.description,
        requirementsHardSkills: formValue.requirementsHardSkills.filter((skill: string) => skill.trim()),
        requirementsSoftSkills: formValue.requirementsSoftSkills.filter((skill: string) => skill.trim()),
        salaryMin: formValue.salaryMin,
        salaryMax: formValue.salaryMax,
        remote: formValue.remote,
        expiresAt: formValue.expiresAt,
        updatedAt: new Date()
      };

      this.jobOfferService.updateJobOffer(this.offer.idJobOffer, updatedOffer).subscribe({
        next: (updatedOffer) => {
          this.router.navigate(['/job-offers', updatedOffer.idJobOffer], {
            queryParams: { updated: 'true' }
          });
        },
        error: (error) => {
          console.error('Error updating job offer:', error);
          this.submitting = false;
        },
        complete: () => {
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    if (this.offer) {
      this.router.navigate(['/job-offers', this.offer.idJobOffer]);
    } else {
      this.router.navigate(['/job-offers']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
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
    if (this.editForm.errors?.['salaryInvalid']) {
      return 'Le salaire minimum doit être inférieur au salaire maximum';
    }
    return '';
  }
}