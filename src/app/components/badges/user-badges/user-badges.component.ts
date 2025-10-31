import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { BadgeService } from '../../../services/badge.service';
import { UserService } from '../../../services/user.service';
import { Badge } from '../../../models/badge.model';
import { User } from '../../../models/user.model';

interface UserBadge {
  badge: Badge;
  earnedAt: Date;
  progress?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
  requirements?: string[];
}

@Component({
  selector: 'app-user-badges',
  templateUrl: './user-badges.component.html',
  styleUrls: ['./user-badges.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent]
})
export class UserBadgesComponent implements OnInit {
  userId: number = 0;
  user: User | null = null;
  userBadges: UserBadge[] = [];
  achievements: Achievement[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private badgeService: BadgeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    if (this.userId) {
      this.loadUser();
      this.loadUserBadges();
      this.loadAchievements();
    }
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  loadUserBadges(): void {
    this.loading = true;
    // TODO: Implement method to get user badges from BadgeService
    // For now, using mock data
    this.userBadges = [
      {
        badge: {
          id: 1,
          nom: 'Premier Pas',
          description: 'Complétez votre première formation'
        },
        earnedAt: new Date('2024-01-15')
      },
      {
        badge: {
          id: 2,
          nom: 'Expert Certifié',
          description: 'Obtenez 3 certifications'
        },
        earnedAt: new Date('2024-02-10')
      },
      {
        badge: {
          id: 3,
          nom: 'Mentor Actif',
          description: 'Aidez 5 apprenants'
        },
        earnedAt: new Date('2024-03-05')
      }
    ];
    this.loading = false;
  }

  loadAchievements(): void {
    // Mock achievements data
    this.achievements = [
      {
        id: 'first-course',
        title: 'Premier Cours',
        description: 'Complétez votre premier cours',
        icon: 'fas fa-graduation-cap',
        status: 'completed',
        progress: 100
      },
      {
        id: 'five-courses',
        title: 'Apprenant Assidu',
        description: 'Complétez 5 cours',
        icon: 'fas fa-book-open',
        status: 'in-progress',
        progress: 60,
        requirements: ['Compléter 3 cours supplémentaires']
      },
      {
        id: 'first-certification',
        title: 'Certifié',
        description: 'Obtenez votre première certification',
        icon: 'fas fa-certificate',
        status: 'in-progress',
        progress: 75,
        requirements: ['Passer l\'examen final']
      },
      {
        id: 'mentor',
        title: 'Mentor',
        description: 'Devenez mentor et aidez les autres',
        icon: 'fas fa-users',
        status: 'locked',
        requirements: ['Avoir 5 certifications', 'Maintenir une moyenne de 4.5/5']
      },
      {
        id: 'expert',
        title: 'Expert',
        description: 'Atteignez le niveau expert',
        icon: 'fas fa-crown',
        status: 'locked',
        requirements: ['10 certifications', 'Mentor depuis 1 an', 'Note moyenne 4.8/5']
      }
    ];
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
  }

  getTotalBadges(): number {
    return this.userBadges.length;
  }

  getRecentBadges(): number {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return this.userBadges.filter(badge => badge.earnedAt >= lastMonth).length;
  }

  getCompletedAchievements(): number {
    return this.achievements.filter(a => a.status === 'completed').length;
  }

  getBadgeIcon(badge: Badge): string {
    const name = badge.nom.toLowerCase();
    if (name.includes('premier') || name.includes('first')) return 'fas fa-star';
    if (name.includes('expert') || name.includes('certif')) return 'fas fa-certificate';
    if (name.includes('mentor')) return 'fas fa-users';
    return 'fas fa-medal';
  }

  getBadgeCategory(badge: Badge): string {
    const name = badge.nom.toLowerCase();
    if (name.includes('premier') || name.includes('first')) return 'Débutant';
    if (name.includes('expert') || name.includes('certif')) return 'Expertise';
    if (name.includes('mentor')) return 'Communauté';
    return 'Général';
  }

  shareBadge(badge: UserBadge): void {
    // TODO: Implement badge sharing functionality
    console.log('Sharing badge:', badge.badge.nom);
  }

  viewBadgeDetails(badge: Badge): void {
    // TODO: Navigate to badge detail page
    console.log('Viewing badge details:', badge.nom);
  }

  trackByBadgeId(index: number, userBadge: UserBadge): number {
    return userBadge.badge.id;
  }

  trackByAchievementId(index: number, achievement: Achievement): string {
    return achievement.id;
  }
}