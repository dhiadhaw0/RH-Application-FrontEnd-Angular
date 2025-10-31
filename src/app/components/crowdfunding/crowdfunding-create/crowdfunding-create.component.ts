import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CrowdfundingService } from '../../../services/crowdfunding.service';
import { AuthService } from '../../../services/auth.service';
import { FundingCampaign, CampaignCategory, CampaignStatus, ContributionTier } from '../../../models/funding-campaign.model';
import { CareerGoal, CareerGoalCategory, CareerGoalStatus } from '../../../models/career-goal.model';

@Component({
  selector: 'app-crowdfunding-create',
  standalone: false,
  templateUrl: './crowdfunding-create.component.html',
  styleUrl: './crowdfunding-create.component.scss'
})
export class CrowdfundingCreateComponent implements OnInit {
  campaignForm: FormGroup;
  loading = false;
  submitting = false;
  currentUser: any;

  categories = Object.values(CampaignCategory);
  goalCategories = Object.values(CareerGoalCategory);

  constructor(
    private fb: FormBuilder,
    private crowdfundingService: CrowdfundingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.campaignForm = this.createForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Career Goal Section
      careerGoal: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        category: [CampaignCategory.OTHER, Validators.required],
        targetAmount: [0, [Validators.required, Validators.min(1)]],
        endDate: ['', Validators.required]
      }),

      // Campaign Details
      campaignTitle: ['', [Validators.required, Validators.minLength(5)]],
      campaignDescription: ['', [Validators.required, Validators.minLength(50)]],
      videoUrl: [''],
      tags: [''],

      // Contribution Tiers
      contributionTiers: this.fb.array([this.createTierForm()])
    });
  }

  createTierForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      rewards: ['', Validators.required],
      maxContributors: ['']
    });
  }

  get contributionTiers(): FormArray {
    return this.campaignForm.get('contributionTiers') as FormArray;
  }

  addTier(): void {
    this.contributionTiers.push(this.createTierForm());
  }

  removeTier(index: number): void {
    if (this.contributionTiers.length > 1) {
      this.contributionTiers.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.campaignForm.valid && this.currentUser) {
      this.submitting = true;

      const formValue = this.campaignForm.value;

      // Create career goal first
      const careerGoal: Partial<CareerGoal> = {
        userId: this.currentUser.id,
        title: formValue.careerGoal.title,
        description: formValue.careerGoal.description,
        category: formValue.careerGoal.category,
        targetAmount: formValue.careerGoal.targetAmount,
        currentAmount: 0,
        currency: 'EUR',
        status: CareerGoalStatus.ACTIVE,
        endDate: new Date(formValue.careerGoal.endDate)
      };

      this.crowdfundingService.createCareerGoal(careerGoal).subscribe({
        next: (createdGoal) => {
          // Create campaign
          const campaign: Partial<FundingCampaign> = {
            careerGoalId: createdGoal.id,
            userId: this.currentUser.id,
            title: formValue.campaignTitle,
            description: formValue.campaignDescription,
            category: formValue.careerGoal.category,
            targetAmount: formValue.careerGoal.targetAmount,
            currentAmount: 0,
            currency: 'EUR',
            status: CampaignStatus.DRAFT,
            startDate: new Date(),
            endDate: new Date(formValue.careerGoal.endDate),
            contributionTiers: formValue.contributionTiers.map((tier: any) => ({
              name: tier.name,
              description: tier.description,
              amount: tier.amount,
              currency: 'EUR',
              rewards: tier.rewards.split(',').map((r: string) => r.trim()),
              maxContributors: tier.maxContributors ? parseInt(tier.maxContributors) : undefined,
              currentContributors: 0
            })),
            videoUrl: formValue.videoUrl || undefined,
            tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : undefined
          };

          this.crowdfundingService.createFundingCampaign(campaign).subscribe({
            next: (createdCampaign) => {
              this.submitting = false;
              this.router.navigate(['/crowdfunding', createdCampaign.id]);
            },
            error: (error) => {
              console.error('Error creating campaign:', error);
              this.submitting = false;
            }
          });
        },
        error: (error) => {
          console.error('Error creating career goal:', error);
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.campaignForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/crowdfunding']);
  }

  getMinDate(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getCategoryLabel(category: CampaignCategory): string {
    const labels = {
      [CampaignCategory.EDUCATION]: 'Éducation',
      [CampaignCategory.EQUIPMENT]: 'Équipement',
      [CampaignCategory.CERTIFICATIONS]: 'Certifications',
      [CampaignCategory.TRAINING]: 'Formation',
      [CampaignCategory.BUSINESS]: 'Entreprise',
      [CampaignCategory.OTHER]: 'Autre'
    };
    return labels[category] || category;
  }
}
