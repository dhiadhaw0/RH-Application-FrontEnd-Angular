import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { JobOfferService } from '../../../services/job-offer.service';
import { UserService } from '../../../services/user.service';
import { JobOffer } from '../../../models/job-offer.model';
import { User } from '../../../models/user.model';

interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip' | 'optimization';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  applied?: boolean;
}

@Component({
  selector: 'app-job-offer-suggestions',
  templateUrl: './job-offer-suggestions.component.html',
  styleUrls: ['./job-offer-suggestions.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class JobOfferSuggestionsComponent implements OnInit {
  offer: JobOffer | null = null;
  suggestions: Suggestion[] = [];
  loading = false;
  currentUser: User | null = null;
  isOwner = false;

  // Filter options
  activeFilter: 'all' | 'high' | 'medium' | 'low' = 'all';
  typeFilter: 'all' | 'improvement' | 'warning' | 'tip' | 'optimization' = 'all';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOffer(+id);
      this.loadSuggestions(+id);
    }
    this.loadCurrentUser();
  }

  loadOffer(id: number): void {
    this.loading = true;
    this.jobOfferService.getJobOfferById(id).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.checkPermissions();
        this.generateSuggestions();
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

  loadSuggestions(id: number): void {
    // Try to load suggestions from backend first
    this.jobOfferService.getImprovementSuggestions(id).subscribe({
      next: (backendSuggestions) => {
        if (backendSuggestions && backendSuggestions.length > 0) {
          this.suggestions = this.mapBackendSuggestions(backendSuggestions);
        } else {
          // Fallback to generated suggestions
          this.generateSuggestions();
        }
      },
      error: (error) => {
        console.error('Error loading suggestions from backend:', error);
        // Fallback to generated suggestions
        this.generateSuggestions();
      }
    });
  }

  loadCurrentUser(): void {
    // TODO: Get current user from auth service
    this.currentUser = null;
    this.checkPermissions();
  }

  checkPermissions(): void {
    if (!this.offer || !this.currentUser) return;
    this.isOwner = this.offer.user === this.currentUser.id || this.offer.user === this.currentUser;
  }

  generateSuggestions(): void {
    if (!this.offer) return;

    const suggestions: Suggestion[] = [];

    // Title suggestions
    if (!this.offer.title || this.offer.title.length < 10) {
      suggestions.push({
        id: 'title-length',
        type: 'improvement',
        title: 'Titre trop court',
        description: 'Un titre descriptif et accrocheur améliore l\'attraction des candidats. Essayez d\'inclure le poste et des mots-clés pertinents.',
        priority: 'high',
        category: 'Contenu',
        actionable: true
      });
    }

    if (this.offer.title && this.offer.title.length > 80) {
      suggestions.push({
        id: 'title-too-long',
        type: 'warning',
        title: 'Titre trop long',
        description: 'Les titres trop longs peuvent être tronqués dans les résultats de recherche. Gardez-le concis mais descriptif.',
        priority: 'medium',
        category: 'Contenu',
        actionable: true
      });
    }

    // Description suggestions
    if (!this.offer.description || this.offer.description.length < 100) {
      suggestions.push({
        id: 'description-length',
        type: 'improvement',
        title: 'Description insuffisante',
        description: 'Une description détaillée aide les candidats à comprendre le poste et l\'entreprise. Ajoutez plus de contexte.',
        priority: 'high',
        category: 'Contenu',
        actionable: true
      });
    }

    // Skills suggestions
    const totalSkills = (this.offer.requirementsHardSkills?.length || 0) + (this.offer.requirementsSoftSkills?.length || 0);
    if (totalSkills < 3) {
      suggestions.push({
        id: 'insufficient-skills',
        type: 'improvement',
        title: 'Compétences insuffisantes',
        description: 'Listez plus de compétences pour aider les candidats à évaluer leur adéquation au poste.',
        priority: 'medium',
        category: 'Compétences',
        actionable: true
      });
    }

    if (totalSkills > 15) {
      suggestions.push({
        id: 'too-many-skills',
        type: 'warning',
        title: 'Trop de compétences listées',
        description: 'Une liste trop longue peut décourager les candidats. Concentrez-vous sur les compétences essentielles.',
        priority: 'low',
        category: 'Compétences',
        actionable: true
      });
    }

    // Salary suggestions
    if (!this.offer.salaryMin && !this.offer.salaryMax) {
      suggestions.push({
        id: 'no-salary',
        type: 'tip',
        title: 'Salaire non spécifié',
        description: 'Indiquer une fourchette salariale attire plus de candidats qualifiés et transparents.',
        priority: 'medium',
        category: 'Conditions',
        actionable: true
      });
    }

    // Remote work suggestions
    if (this.offer.remote === undefined || this.offer.remote === null) {
      suggestions.push({
        id: 'remote-unspecified',
        type: 'tip',
        title: 'Télétravail non précisé',
        description: 'Spécifiez si le poste permet le télétravail pour attirer les candidats intéressés.',
        priority: 'low',
        category: 'Conditions',
        actionable: true
      });
    }

    // Expiration suggestions
    if (!this.offer.expiresAt) {
      suggestions.push({
        id: 'no-expiration',
        type: 'warning',
        title: 'Pas de date d\'expiration',
        description: 'Définir une date d\'expiration aide à gérer le processus de recrutement efficacement.',
        priority: 'medium',
        category: 'Gestion',
        actionable: true
      });
    } else {
      const daysUntilExpiry = Math.ceil((new Date(this.offer.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 7) {
        suggestions.push({
          id: 'expires-soon',
          type: 'warning',
          title: 'Expiration proche',
          description: `L'offre expire dans ${daysUntilExpiry} jour(s). Pensez à la prolonger si vous êtes toujours à la recherche.`,
          priority: 'high',
          category: 'Gestion',
          actionable: true
        });
      }
    }

    // Workflow suggestions
    if (this.offer.workflowStatus === 'REDACTION') {
      suggestions.push({
        id: 'submit-for-validation',
        type: 'tip',
        title: 'Soumettre pour validation',
        description: 'Votre offre est prête ? Soumettez-la pour validation afin qu\'elle soit publiée.',
        priority: 'high',
        category: 'Workflow',
        actionable: true
      });
    }

    if (this.offer.workflowStatus === 'REFUSE') {
      suggestions.push({
        id: 'fix-rejection-reasons',
        type: 'improvement',
        title: 'Corriger les problèmes',
        description: 'Votre offre a été refusée. Vérifiez les commentaires et apportez les corrections nécessaires.',
        priority: 'high',
        category: 'Workflow',
        actionable: true
      });
    }

    // SEO suggestions
    const keywords = ['développeur', 'ingénieur', 'manager', 'analyste', 'designer', 'chef', 'senior', 'junior'];
    const titleWords = this.offer.title?.toLowerCase().split(' ') || [];
    const hasKeywords = keywords.some(keyword => titleWords.includes(keyword));

    if (!hasKeywords) {
      suggestions.push({
        id: 'seo-keywords',
        type: 'optimization',
        title: 'Optimisation SEO',
        description: 'Ajoutez des mots-clés populaires dans le titre pour améliorer la visibilité de votre offre.',
        priority: 'low',
        category: 'Visibilité',
        actionable: true
      });
    }

    this.suggestions = suggestions;
  }

  mapBackendSuggestions(backendSuggestions: string[]): Suggestion[] {
    return backendSuggestions.map((suggestion, index) => ({
      id: `backend-${index}`,
      type: 'improvement' as const,
      title: 'Suggestion du système',
      description: suggestion,
      priority: 'medium' as const,
      category: 'IA',
      actionable: true
    }));
  }

  get filteredSuggestions(): Suggestion[] {
    return this.suggestions.filter(suggestion => {
      const priorityMatch = this.activeFilter === 'all' || suggestion.priority === this.activeFilter;
      const typeMatch = this.typeFilter === 'all' || suggestion.type === this.typeFilter;
      return priorityMatch && typeMatch;
    });
  }

  get highPriorityCount(): number {
    return this.filteredSuggestions.filter(s => s.priority === 'high').length;
  }

  setFilter(filter: 'all' | 'high' | 'medium' | 'low'): void {
    this.activeFilter = filter;
  }

  setTypeFilter(type: 'all' | 'improvement' | 'warning' | 'tip' | 'optimization'): void {
    this.typeFilter = type;
  }

  applySuggestion(suggestion: Suggestion): void {
    // TODO: Implement suggestion application logic
    console.log('Applying suggestion:', suggestion.id);
    suggestion.applied = true;
  }

  getSuggestionIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'improvement': 'fas fa-arrow-up',
      'warning': 'fas fa-exclamation-triangle',
      'tip': 'fas fa-lightbulb',
      'optimization': 'fas fa-search-plus'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority] || '#6b7280';
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'improvement': '#3b82f6',
      'warning': '#ef4444',
      'tip': '#f59e0b',
      'optimization': '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  }

  goBack(): void {
    if (this.offer) {
      this.router.navigate(['/job-offers', this.offer.idJobOffer]);
    } else {
      this.router.navigate(['/job-offers']);
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'BROUILLON': '#6b7280',
      'EN_VALIDATION': '#fbbf24',
      'PUBLIQUE': '#10b981',
      'EXPIREE': '#ef4444',
      'ARCHIVEE': '#374151'
    };
    return colors[status] || '#6b7280';
  }

  getWorkflowStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'REDACTION': '#6b7280',
      'EN_ATTENTE_VALIDATION': '#fbbf24',
      'PUBLIE': '#10b981',
      'ARCHIVE': '#374151',
      'REFUSE': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }
}