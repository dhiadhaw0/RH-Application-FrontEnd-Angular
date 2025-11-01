import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillCreditShowcaseComponent } from '../skill-credits/skill-credit-showcase/skill-credit-showcase.component';
import { CompanyProfileService } from '../../services/company-profile.service';
import { CompanyProfile } from '../../models/company-profile.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Recommendation } from '../../models/recommendation.model';

interface Activity {
  type: 'formation' | 'job' | 'user';
  icon: string;
  title: string;
  description: string;
  time: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SkillCreditShowcaseComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stats = {
    formations: 0,
    jobOffers: 0,
    users: 0,
    applications: 0
  };

  featuredCompanies: CompanyProfile[] = [];
  currentUser: any = null;
  userRecommendations: Recommendation[] = [];

  recentActivities: Activity[] = [
    {
      type: 'formation',
      icon: 'fas fa-graduation-cap',
      title: 'Nouvelle formation disponible',
      description: 'Formation "Développement Web Full-Stack" ajoutée au catalogue',
      time: 'Il y a 2 heures'
    },
    {
      type: 'job',
      icon: 'fas fa-briefcase',
      title: 'Offre d\'emploi publiée',
      description: 'Poste de Développeur Senior React chez TechCorp',
      time: 'Il y a 4 heures'
    },
    {
      type: 'user',
      icon: 'fas fa-user-plus',
      title: 'Nouveau mentor inscrit',
      description: 'Marie Dupont rejoint la communauté des mentors',
      time: 'Il y a 6 heures'
    },
    {
      type: 'formation',
      icon: 'fas fa-certificate',
      title: 'Certification obtenue',
      description: 'Jean Martin obtient sa certification AWS',
      time: 'Il y a 8 heures'
    },
    {
      type: 'job',
      icon: 'fas fa-handshake',
      title: 'Candidature acceptée',
      description: 'Sophie Leroy obtient un entretien chez InnoTech',
      time: 'Il y a 12 heures'
    },
    {
      type: 'user',
      icon: 'fas fa-star',
      title: 'Badge débloqué',
      description: 'Pierre Dubois obtient le badge "Mentor d\'Or"',
      time: 'Il y a 1 jour'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Alice Martin',
      role: 'Développeuse Full-Stack',
      avatar: '/assets/testimonials/avatar-1.jpg',
      text: 'StageHub m\'a permis de trouver ma première opportunité en développement web. Les formations sont excellentes et le système de mentorat m\'a beaucoup aidée.',
      rating: 5
    },
    {
      name: 'Thomas Dubois',
      role: 'Chef de Projet',
      avatar: '/assets/testimonials/avatar-2.jpg',
      text: 'En tant que recruteur, StageHub nous aide à identifier les meilleurs talents grâce à son système d\'analyse IA. Une plateforme indispensable.',
      rating: 5
    },
    {
      name: 'Emma Laurent',
      role: 'Mentor Senior',
      avatar: '/assets/testimonials/avatar-3.jpg',
      text: 'Partager mes connaissances avec la nouvelle génération est gratifiant. StageHub facilite les connexions et rend le mentorat accessible à tous.',
      rating: 5
    },
    {
      name: 'Lucas Moreau',
      role: 'Étudiant en Informatique',
      avatar: '/assets/testimonials/avatar-4.jpg',
      text: 'Les formations sont de qualité professionnelle et le système de recommandation m\'aide à progresser rapidement dans ma carrière.',
      rating: 5
    }
  ];

 constructor(
   private companyProfileService: CompanyProfileService,
   private authService: AuthService,
   private userService: UserService
 ) {}

 ngOnInit(): void {
   this.loadStats();
   this.loadFeaturedCompanies();
   this.currentUser = this.authService.getCurrentUser();
   if (this.currentUser?.id) {
     this.loadUserRecommendations();
   }
 }

  private loadStats(): void {
    // Load real stats from services
    this.loadRealStats();
  }

  private loadRealStats(): void {
    // TODO: Implement real API calls to get stats
    // For now, using mock data with more realistic numbers
    this.stats = {
      formations: 247,
      jobOffers: 89,
      users: 12543,
      applications: 3421
    };
  }

  private loadFeaturedCompanies(): void {
    // Load featured companies from service
    this.companyProfileService.getPopularCompanies(6).subscribe({
      next: (companies) => {
        this.featuredCompanies = companies;
      },
      error: (error) => {
        console.error('Error loading featured companies:', error);
        // Load mock data if API fails
        this.loadMockCompanies();
      }
    });
  }

  private loadMockCompanies(): void {
    this.featuredCompanies = [
      {
        id: 1,
        name: 'TechCorp Solutions',
        description: 'Leader dans les solutions technologiques innovantes pour les entreprises modernes.',
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
            content: 'TechCorp offre un environnement de travail stimulant avec des projets innovants.',
            isVerified: true,
            createdAt: new Date('2024-01-15')
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
          }
        ],
        cultureVideos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'],
        photos: [
          'https://via.placeholder.com/400x300/667eea/white?text=Office+1',
          'https://via.placeholder.com/400x300/764ba2/white?text=Team+Event'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 2,
        name: 'DataFlow Analytics',
        description: 'Spécialiste de l\'analyse de données et du business intelligence.',
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
            id: 2,
            employeeName: 'Jean Martin',
            employeePosition: 'Data Scientist',
            employeeAvatar: 'https://via.placeholder.com/50x50/4ECDC4/white?text=JM',
            rating: 4,
            title: 'Projets passionnants',
            content: 'Travailler sur des projets d\'IA et de machine learning est très enrichissant.',
            isVerified: true,
            createdAt: new Date('2024-02-20')
          }
        ],
        benefits: [
          {
            id: 3,
            name: 'Participation aux bénéfices',
            description: 'Part variable basée sur les résultats de l\'entreprise',
            category: 'FINANCIAL' as any,
            isActive: true
          }
        ],
        cultureVideos: [],
        photos: [
          'https://via.placeholder.com/400x300/764ba2/white?text=Data+Center'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 3,
        name: 'GreenEnergy Corp',
        description: 'Pionnier dans les solutions énergétiques renouvelables.',
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
            id: 3,
            employeeName: 'Pierre Dubois',
            employeePosition: 'Ingénieur R&D',
            employeeAvatar: 'https://via.placeholder.com/50x50/FFA07A/white?text=PD',
            rating: 4,
            title: 'Mission environnementale',
            content: 'Contribuer à la transition énergétique est très motivant.',
            isVerified: true,
            createdAt: new Date('2024-04-05')
          }
        ],
        benefits: [
          {
            id: 4,
            name: 'Véhicule électrique',
            description: 'Prêt de véhicule électrique pour les déplacements professionnels',
            category: 'PERKS' as any,
            isActive: true
          }
        ],
        cultureVideos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'],
        photos: [
          'https://via.placeholder.com/400x300/28a745/white?text=Solar+Farm',
          'https://via.placeholder.com/400x300/20B2AA/white?text=Wind+Turbines'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      }
    ];
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

  getAverageRating(company: CompanyProfile): number {
    if (!company.testimonials || company.testimonials.length === 0) return 0;
    const sum = company.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / company.testimonials.length) * 10) / 10;
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.id) {
      this.loadUserRecommendations();
    }
  }

  private loadUserRecommendations(): void {
    if (!this.currentUser?.id) return;
    this.userService.getRecommendations(this.currentUser.id).subscribe({
      next: (recommendations) => {
        this.userRecommendations = recommendations;
      },
      error: (error) => {
        console.error('Error loading user recommendations:', error);
        this.userRecommendations = [];
      }
    });
  }

  getRecommendationsCount(type: string): number {
    return this.userRecommendations.filter(rec => rec.type === type).length;
  }
}