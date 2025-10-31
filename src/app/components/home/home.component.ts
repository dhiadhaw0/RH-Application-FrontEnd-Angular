import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillCreditShowcaseComponent } from '../skill-credits/skill-credit-showcase/skill-credit-showcase.component';
//import { AuthService } from '../../services/auth.service';

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

 // constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadStats();
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
}