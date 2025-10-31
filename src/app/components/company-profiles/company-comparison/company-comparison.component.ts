import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyProfileService } from '../../../services/company-profile.service';
import { CompanyProfile } from '../../../models/company-profile.model';

@Component({
  selector: 'app-company-comparison',
  standalone: false,
  templateUrl: './company-comparison.component.html',
  styleUrl: './company-comparison.component.scss'
})
export class CompanyComparisonComponent implements OnInit {
  companies: CompanyProfile[] = [];
  loading = false;
  error: string | null = null;
  selectedCriteria: string[] = ['rating', 'followers', 'benefits', 'size'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyProfileService: CompanyProfileService
  ) {}

  ngOnInit(): void {
    const companyIds = this.route.snapshot.queryParams['ids'];
    if (companyIds) {
      this.loadCompaniesForComparison(companyIds.split(','));
    }
  }

  loadCompaniesForComparison(ids: string[]): void {
    this.loading = true;
    this.error = null;

    this.companyProfileService.compareCompanies(ids.map(id => +id)).subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des entreprises à comparer';
        this.loading = false;
        console.error('Error loading companies for comparison:', error);
      }
    });
  }

  addCompanyToComparison(companyId: number): void {
    const currentIds = this.companies.map(c => c.id);
    if (!currentIds.includes(companyId) && currentIds.length < 4) {
      this.loadCompaniesForComparison([...currentIds, companyId].map(id => id.toString()));
    }
  }

  removeCompanyFromComparison(companyId: number): void {
    const currentIds = this.companies.map(c => c.id).filter(id => id !== companyId);
    if (currentIds.length > 1) {
      this.loadCompaniesForComparison(currentIds.map(id => id.toString()));
    }
  }

  toggleCriteria(criterion: string): void {
    const index = this.selectedCriteria.indexOf(criterion);
    if (index > -1) {
      this.selectedCriteria.splice(index, 1);
    } else {
      this.selectedCriteria.push(criterion);
    }
  }

  isCriteriaSelected(criterion: string): boolean {
    return this.selectedCriteria.includes(criterion);
  }

  getAverageRating(company: CompanyProfile): number {
    if (!company.testimonials || company.testimonials.length === 0) return 0;
    const sum = company.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / company.testimonials.length) * 10) / 10;
  }

  getBenefitsCount(company: CompanyProfile): number {
    return company.benefits?.filter(b => b.isActive).length || 0;
  }

  getTopBenefits(company: CompanyProfile): string[] {
    return company.benefits?.filter(b => b.isActive).slice(0, 3).map(b => b.name) || [];
  }

  navigateToCompany(companyId: number): void {
    this.router.navigate(['/companies', companyId]);
  }

  shareComparison(): void {
    const companyIds = this.companies.map(c => c.id).join(',');
    const url = `${window.location.origin}/companies/compare?ids=${companyIds}`;

    if (navigator.share) {
      navigator.share({
        title: 'Comparaison d\'entreprises StageHub',
        text: `Comparez ${this.companies.length} entreprises sur StageHub`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  exportComparison(): void {
    // Create a simple text export of the comparison
    let exportText = 'Comparaison d\'Entreprises - StageHub\n\n';

    this.companies.forEach((company, index) => {
      exportText += `${index + 1}. ${company.name}\n`;
      exportText += `   Secteur: ${company.industry}\n`;
      exportText += `   Taille: ${company.size} employés\n`;
      exportText += `   Note: ${this.getAverageRating(company)}/5\n`;
      exportText += `   Abonnés: ${company.followersCount}\n`;
      exportText += `   Avantages: ${this.getBenefitsCount(company)}\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparaison-entreprises.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
