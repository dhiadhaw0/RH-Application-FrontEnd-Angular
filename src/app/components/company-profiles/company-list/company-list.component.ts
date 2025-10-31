import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyProfileService } from '../../../services/company-profile.service';
import { CompanyProfile } from '../../../models/company-profile.model';

@Component({
  selector: 'app-company-list',
  standalone: false,
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent implements OnInit {
  companies: CompanyProfile[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  selectedIndustry = '';
  selectedSize = '';
  sortBy = 'name';

  industries = [
    'Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce',
    'Industrie', 'Services', 'Médias', 'Transport', 'Immobilier'
  ];

  companySizes = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  constructor(
    private companyProfileService: CompanyProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMockCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = null;

    const params: any = {};

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    if (this.selectedIndustry) {
      params.industry = this.selectedIndustry;
    }

    if (this.selectedSize) {
      params.size = this.selectedSize;
    }

    if (this.sortBy) {
      params.sort = this.sortBy;
    }

    this.companyProfileService.getCompanyProfiles(params).subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des entreprises';
        this.loading = false;
        console.error('Error loading companies:', error);
      }
    });
  }

  onSearch(): void {
    this.loadMockCompanies();
  }

  onFilterChange(): void {
    this.loadMockCompanies();
  }

  onSortChange(): void {
    this.loadMockCompanies();
  }

  followCompany(company: CompanyProfile): void {
    this.companyProfileService.followCompany(company.id).subscribe({
      next: () => {
        company.isFollowing = true;
        company.followersCount++;
      },
      error: (error) => {
        console.error('Error following company:', error);
      }
    });
  }

  unfollowCompany(company: CompanyProfile): void {
    this.companyProfileService.unfollowCompany(company.id).subscribe({
      next: () => {
        company.isFollowing = false;
        company.followersCount--;
      },
      error: (error) => {
        console.error('Error unfollowing company:', error);
      }
    });
  }

  viewCompanyProfile(companyId: number): void {
    this.router.navigate(['/companies', companyId]);
  }

  getAverageRating(company: CompanyProfile): number {
    if (!company.testimonials || company.testimonials.length === 0) return 0;
    const sum = company.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / company.testimonials.length) * 10) / 10;
  }

  getBenefitsCount(company: CompanyProfile): number {
    return company.benefits?.filter(b => b.isActive).length || 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedIndustry = '';
    this.selectedSize = '';
    this.sortBy = 'name';
    this.loadMockCompanies();
  }

  private loadMockCompanies(): void {
    this.loading = false;
    this.error = null;

    // Mock data for demonstration
    this.companies = [
      {
        id: 1,
        name: 'TechCorp Solutions',
        description: 'Leader dans les solutions technologiques innovantes pour les entreprises modernes. Nous développons des applications web et mobiles de pointe.',
        logo: 'https://via.placeholder.com/120x120/667eea/white?text=TC',
        website: 'https://techcorp.com',
        industry: 'Technologie',
        size: '201-500',
        foundedYear: 2015,
        headquarters: 'Paris, France',
        followersCount: 1250,
        isFollowing: false,
        testimonials: [
          {
            id: 1,
            employeeName: 'Marie Dupont',
            employeePosition: 'Développeuse Senior',
            employeeAvatar: 'https://via.placeholder.com/50x50/FF6B6B/white?text=MD',
            rating: 5,
            title: 'Excellente ambiance de travail',
            content: 'TechCorp offre un environnement de travail stimulant avec des projets innovants et une équipe exceptionnelle.',
            isVerified: true,
            createdAt: new Date('2024-01-15')
          },
          {
            id: 2,
            employeeName: 'Jean Martin',
            employeePosition: 'Chef de Projet',
            employeeAvatar: 'https://via.placeholder.com/50x50/4ECDC4/white?text=JM',
            rating: 4,
            title: 'Opportunités de croissance',
            content: 'Beaucoup d\'opportunités d\'évolution professionnelle et de formation continue.',
            isVerified: true,
            createdAt: new Date('2024-02-20')
          }
        ],
        benefits: [
          {
            id: 1,
            name: 'Télétravail flexible',
            description: '3 jours de télétravail par semaine',
            category: 'WORK_LIFE_BALANCE' as any,
            isActive: true
          },
          {
            id: 2,
            name: 'Formation continue',
            description: 'Budget annuel de 2000€ pour la formation',
            category: 'PROFESSIONAL_DEVELOPMENT' as any,
            isActive: true
          },
          {
            id: 3,
            name: 'Mutuelle santé',
            description: 'Couverture santé complète pour tous les employés',
            category: 'HEALTH' as any,
            isActive: true
          }
        ],
        cultureVideos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'],
        photos: [
          'https://via.placeholder.com/400x300/667eea/white?text=Office+1',
          'https://via.placeholder.com/400x300/764ba2/white?text=Team+Event',
          'https://via.placeholder.com/400x300/667eea/white?text=Workspace'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 2,
        name: 'DataFlow Analytics',
        description: 'Spécialiste de l\'analyse de données et du business intelligence. Nous aidons les entreprises à prendre des décisions éclairées.',
        logo: 'https://via.placeholder.com/120x120/764ba2/white?text=DF',
        website: 'https://dataflow-analytics.com',
        industry: 'Technologie',
        size: '51-200',
        foundedYear: 2018,
        headquarters: 'Lyon, France',
        followersCount: 890,
        isFollowing: false,
        testimonials: [
          {
            id: 3,
            employeeName: 'Sophie Laurent',
            employeePosition: 'Data Scientist',
            employeeAvatar: 'https://via.placeholder.com/50x50/45B7D1/white?text=SL',
            rating: 5,
            title: 'Projets passionnants',
            content: 'Travailler sur des projets d\'IA et de machine learning est très enrichissant.',
            isVerified: true,
            createdAt: new Date('2024-03-10')
          }
        ],
        benefits: [
          {
            id: 4,
            name: 'Participation aux bénéfices',
            description: 'Part variable basée sur les résultats de l\'entreprise',
            category: 'FINANCIAL' as any,
            isActive: true
          },
          {
            id: 5,
            name: 'Salle de sport',
            description: 'Accès gratuit à une salle de sport sur site',
            category: 'HEALTH' as any,
            isActive: true
          }
        ],
        cultureVideos: [],
        photos: [
          'https://via.placeholder.com/400x300/764ba2/white?text=Data+Center',
          'https://via.placeholder.com/400x300/667eea/white?text=Conference'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 3,
        name: 'GreenEnergy Corp',
        description: 'Pionnier dans les solutions énergétiques renouvelables. Nous développons des technologies pour un avenir durable.',
        logo: 'https://via.placeholder.com/120x120/28a745/white?text=GE',
        website: 'https://greenenergy.com',
        industry: 'Industrie',
        size: '501-1000',
        foundedYear: 2012,
        headquarters: 'Marseille, France',
        followersCount: 2100,
        isFollowing: false,
        testimonials: [
          {
            id: 4,
            employeeName: 'Pierre Dubois',
            employeePosition: 'Ingénieur R&D',
            employeeAvatar: 'https://via.placeholder.com/50x50/FFA07A/white?text=PD',
            rating: 4,
            title: 'Mission environnementale',
            content: 'Contribuer à la transition énergétique est très motivant.',
            isVerified: true,
            createdAt: new Date('2024-04-05')
          },
          {
            id: 5,
            employeeName: 'Claire Moreau',
            employeePosition: 'Responsable RH',
            employeeAvatar: 'https://via.placeholder.com/50x50/98D8C8/white?text=CM',
            rating: 5,
            title: 'Valeurs alignées',
            content: 'L\'entreprise partage mes valeurs environnementales et sociales.',
            isVerified: true,
            createdAt: new Date('2024-05-12')
          }
        ],
        benefits: [
          {
            id: 6,
            name: 'Véhicule électrique',
            description: 'Prêt de véhicule électrique pour les déplacements professionnels',
            category: 'PERKS' as any,
            isActive: true
          },
          {
            id: 7,
            name: 'Jours de congé extra',
            description: '2 jours de congé supplémentaires pour les actions écologiques',
            category: 'WORK_LIFE_BALANCE' as any,
            isActive: true
          }
        ],
        cultureVideos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'],
        photos: [
          'https://via.placeholder.com/400x300/28a745/white?text=Solar+Farm',
          'https://via.placeholder.com/400x300/20B2AA/white?text=Wind+Turbines',
          'https://via.placeholder.com/400x300/28a745/white?text=Team+Building'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 4,
        name: 'EduTech Academy',
        description: 'Plateforme d\'éducation en ligne révolutionnaire. Nous rendons l\'apprentissage accessible à tous.',
        logo: 'https://via.placeholder.com/120x120/17a2b8/white?text=EA',
        website: 'https://edutech-academy.com',
        industry: 'Éducation',
        size: '11-50',
        foundedYear: 2020,
        headquarters: 'Toulouse, France',
        followersCount: 650,
        isFollowing: false,
        testimonials: [
          {
            id: 6,
            employeeName: 'Antoine Bernard',
            employeePosition: 'Développeur Frontend',
            employeeAvatar: 'https://via.placeholder.com/50x50/87CEEB/white?text=AB',
            rating: 5,
            title: 'Impact positif',
            content: 'Voir nos utilisateurs progresser grâce à nos outils est très gratifiant.',
            isVerified: true,
            createdAt: new Date('2024-06-18')
          }
        ],
        benefits: [
          {
            id: 8,
            name: 'Accès gratuit aux formations',
            description: 'Accès illimité à toutes nos formations en ligne',
            category: 'PROFESSIONAL_DEVELOPMENT' as any,
            isActive: true
          },
          {
            id: 9,
            name: 'Horaires flexibles',
            description: 'Horaires de travail adaptés aux besoins personnels',
            category: 'WORK_LIFE_BALANCE' as any,
            isActive: true
          }
        ],
        cultureVideos: [],
        photos: [
          'https://via.placeholder.com/400x300/17a2b8/white?text=Classroom',
          'https://via.placeholder.com/400x300/4682B4/white?text=Online+Learning'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 5,
        name: 'FinancePlus Group',
        description: 'Services financiers innovants pour particuliers et entreprises. Gestion patrimoniale et conseils financiers.',
        logo: 'https://via.placeholder.com/120x120/ffc107/white?text=FP',
        website: 'https://financeplus.com',
        industry: 'Finance',
        size: '51-200',
        foundedYear: 2010,
        headquarters: 'Bordeaux, France',
        followersCount: 1450,
        isFollowing: false,
        testimonials: [
          {
            id: 7,
            employeeName: 'Isabelle Roux',
            employeePosition: 'Conseillère Financière',
            employeeAvatar: 'https://via.placeholder.com/50x50/F0E68C/white?text=IR',
            rating: 4,
            title: 'Environnement stable',
            content: 'Secteur stable avec de bonnes perspectives d\'évolution.',
            isVerified: true,
            createdAt: new Date('2024-07-22')
          },
          {
            id: 8,
            employeeName: 'Marc Leroy',
            employeePosition: 'Analyste Financier',
            employeeAvatar: 'https://via.placeholder.com/50x50/DDA0DD/white?text=ML',
            rating: 5,
            title: 'Formation de qualité',
            content: 'Formations continues excellentes et certifications reconnues.',
            isVerified: true,
            createdAt: new Date('2024-08-08')
          }
        ],
        benefits: [
          {
            id: 10,
            name: 'Prime de performance',
            description: 'Prime annuelle basée sur les objectifs individuels et collectifs',
            category: 'FINANCIAL' as any,
            isActive: true
          },
          {
            id: 11,
            name: 'Assurance vie entreprise',
            description: 'Plan d\'épargne retraite avec participation de l\'employeur',
            category: 'FINANCIAL' as any,
            isActive: true
          }
        ],
        cultureVideos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'],
        photos: [
          'https://via.placeholder.com/400x300/ffc107/white?text=Office+Building',
          'https://via.placeholder.com/400x300/FFD700/white?text=Meeting+Room',
          'https://via.placeholder.com/400x300/ffc107/white?text=Team+Outing'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 6,
        name: 'MediCare Solutions',
        description: 'Solutions technologiques pour le secteur de la santé. Développement de logiciels médicaux et télémédecine.',
        logo: 'https://via.placeholder.com/120x120/dc3545/white?text=MS',
        website: 'https://medicare-solutions.com',
        industry: 'Santé',
        size: '201-500',
        foundedYear: 2016,
        headquarters: 'Nantes, France',
        followersCount: 980,
        isFollowing: false,
        testimonials: [
          {
            id: 9,
            employeeName: 'Dr. Hélène Petit',
            employeePosition: 'Chef de Projet Médical',
            employeeAvatar: 'https://via.placeholder.com/50x50/FFB6C1/white?text=HP',
            rating: 5,
            title: 'Mission utile',
            content: 'Contribuer à améliorer les soins de santé est extrêmement valorisant.',
            isVerified: true,
            createdAt: new Date('2024-09-14')
          }
        ],
        benefits: [
          {
            id: 12,
            name: 'Mutuelle premium',
            description: 'Couverture santé étendue incluant médecine douce',
            category: 'HEALTH' as any,
            isActive: true
          },
          {
            id: 13,
            name: 'Congé parental étendu',
            description: '6 mois de congé parental payé à 100%',
            category: 'WORK_LIFE_BALANCE' as any,
            isActive: true
          }
        ],
        cultureVideos: [],
        photos: [
          'https://via.placeholder.com/400x300/dc3545/white?text=Medical+Tech',
          'https://via.placeholder.com/400x300/CD5C5C/white?text=Healthcare'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      }
    ];

    // Apply filters and sorting
    this.applyFiltersAndSorting();
  }

  private applyFiltersAndSorting(): void {
    let filteredCompanies = [...this.companies];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredCompanies = filteredCompanies.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.description.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query)
      );
    }

    // Apply industry filter
    if (this.selectedIndustry) {
      filteredCompanies = filteredCompanies.filter(company =>
        company.industry === this.selectedIndustry
      );
    }

    // Apply size filter
    if (this.selectedSize) {
      filteredCompanies = filteredCompanies.filter(company =>
        company.size === this.selectedSize
      );
    }

    // Apply sorting
    filteredCompanies.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'followers':
          return b.followersCount - a.followersCount;
        case 'rating':
          return this.getAverageRating(b) - this.getAverageRating(a);
        case 'size':
          return this.getSizeOrder(a.size) - this.getSizeOrder(b.size);
        default:
          return 0;
      }
    });

    this.companies = filteredCompanies;
  }

  private getSizeOrder(size: string): number {
    const order = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    return order.indexOf(size);
  }
}
