import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CompanyProfile, EmployeeTestimonial, CompanyBenefit, BenefitCategory } from '../../../models/company-profile.model';
import { CompanyProfileService } from '../../../services/company-profile.service';

@Component({
  selector: 'app-company-profile',
  standalone: false,
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  companyProfile: CompanyProfile | null = null;
  testimonials: EmployeeTestimonial[] = [];
  benefits: CompanyBenefit[] = [];
  isFollowing = false;
  loading = true;
  error: string | null = null;
  activeTab: 'overview' | 'testimonials' | 'benefits' | 'gallery' = 'overview';
  showTestimonialForm = false;
  newTestimonial: Partial<EmployeeTestimonial> = {
    rating: 5,
    title: '',
    content: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyProfileService: CompanyProfileService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadCompanyProfile(+id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCompanyProfile(id: number): void {
    this.loading = true;
    this.error = null;

    this.companyProfileService.getCompanyProfile(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.companyProfile = profile;
          this.loadTestimonials(id);
          this.loadBenefits(id);
          this.checkFollowingStatus(id);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement du profil entreprise';
          this.loading = false;
          console.error('Error loading company profile:', error);
        }
      });
  }

  loadTestimonials(companyId: number): void {
    this.companyProfileService.getTestimonials(companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (testimonials) => {
          this.testimonials = testimonials;
        },
        error: (error) => {
          console.error('Error loading testimonials:', error);
        }
      });
  }

  loadBenefits(companyId: number): void {
    this.companyProfileService.getBenefits(companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (benefits) => {
          this.benefits = benefits;
        },
        error: (error) => {
          console.error('Error loading benefits:', error);
        }
      });
  }

  checkFollowingStatus(companyId: number): void {
    this.companyProfileService.isFollowing(companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isFollowing) => {
          this.isFollowing = isFollowing;
        },
        error: (error) => {
          console.error('Error checking follow status:', error);
        }
      });
  }

  toggleFollow(): void {
    if (!this.companyProfile) return;

    const action = this.isFollowing ? 'unfollowCompany' : 'followCompany';
    this.companyProfileService[action](this.companyProfile.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isFollowing = !this.isFollowing;
          if (this.companyProfile) {
            this.companyProfile.followersCount += this.isFollowing ? 1 : -1;
          }
        },
        error: (error) => {
          console.error('Error toggling follow:', error);
        }
      });
  }

  submitTestimonial(): void {
    if (!this.companyProfile || !this.newTestimonial.title || !this.newTestimonial.content) {
      return;
    }

    this.companyProfileService.addTestimonial(this.companyProfile.id, this.newTestimonial)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (testimonial) => {
          this.testimonials.unshift(testimonial);
          this.showTestimonialForm = false;
          this.newTestimonial = { rating: 5, title: '', content: '' };
        },
        error: (error) => {
          console.error('Error submitting testimonial:', error);
        }
      });
  }

  setActiveTab(tab: 'overview' | 'testimonials' | 'benefits' | 'gallery'): void {
    this.activeTab = tab;
  }

  getBenefitsByCategory(category: BenefitCategory): CompanyBenefit[] {
    return this.benefits.filter(benefit => benefit.category === category && benefit.isActive);
  }

  getActiveBenefitsCount(): number {
    return this.benefits.filter(b => b.isActive).length;
  }

  getAverageRating(): number {
    if (this.testimonials.length === 0) return 0;
    const sum = this.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / this.testimonials.length) * 10) / 10;
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  navigateToJobOffers(): void {
    if (this.companyProfile) {
      this.router.navigate(['/job-offers'], {
        queryParams: { company: this.companyProfile.name }
      });
    }
  }

  shareProfile(): void {
    if (navigator.share && this.companyProfile) {
      navigator.share({
        title: this.companyProfile.name,
        text: `Découvrez le profil de ${this.companyProfile.name} sur StageHub`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
