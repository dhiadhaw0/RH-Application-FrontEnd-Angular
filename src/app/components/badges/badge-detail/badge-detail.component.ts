import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { BadgeService } from '../../../services/badge.service';
import { Badge } from '../../../models/badge.model';

interface RecentEarner {
  id: number;
  name: string;
  earnedAt: Date;
  avatar?: string;
}

@Component({
  selector: 'app-badge-detail',
  templateUrl: './badge-detail.component.html',
  styleUrls: ['./badge-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class BadgeDetailComponent implements OnInit {
  badgeId: number = 0;
  badge: Badge | null = null;
  recentEarners: RecentEarner[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private badgeService: BadgeService
  ) {}

  ngOnInit(): void {
    this.badgeId = +this.route.snapshot.params['id'];
    if (this.badgeId) {
      this.loadBadge();
      this.loadRecentEarners();
    }
  }

  loadBadge(): void {
    this.loading = true;
    this.badgeService.getBadgeById(this.badgeId).subscribe({
      next: (badge) => {
        this.badge = badge;
      },
      error: (error) => {
        console.error('Error loading badge:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadRecentEarners(): void {
    // TODO: Implement method to get recent earners from BadgeService
    // For now, using mock data
    this.recentEarners = [
      {
        id: 1,
        name: 'Dhia Eddine Toumi',
        earnedAt: new Date('2024-01-15'),
        avatar: 'AD'
      },
      {
        id: 2,
        name: 'Nour saidi',
        earnedAt: new Date('2024-01-12'),
        avatar: 'BM'
      },
      {
        id: 3,
        name: 'Mouhanned Belhaj',
        earnedAt: new Date('2024-01-10'),
        avatar: 'CB'
      }
    ];
  }

  getBadgeIcon(): string {
    if (!this.badge) return 'fas fa-medal';

    const name = this.badge.nom.toLowerCase();
    if (name.includes('achievement')) return 'fas fa-trophy';
    if (name.includes('skill')) return 'fas fa-star';
    if (name.includes('participation')) return 'fas fa-users';
    if (name.includes('special')) return 'fas fa-crown';
    return 'fas fa-medal';
  }

  getBadgeCategory(): string {
    if (!this.badge) return 'Général';

    const name = this.badge.nom.toLowerCase();
    if (name.includes('achievement')) return 'Accomplissement';
    if (name.includes('skill')) return 'Compétence';
    if (name.includes('participation')) return 'Participation';
    if (name.includes('special')) return 'Spécial';
    return 'Général';
  }

  getTotalEarners(): number {
    // TODO: Implement method to get total earners from BadgeService
    return Math.floor(Math.random() * 200) + 10; // Mock data
  }

  getEarnedThisMonth(): number {
    // TODO: Implement method to get recent earners from BadgeService
    return Math.floor(Math.random() * 25) + 1; // Mock data
  }

  getBadgeRarity(): number {
    // TODO: Implement rarity calculation based on total users vs earners
    return Math.floor(Math.random() * 30) + 5; // Mock data: 5-35% rarity
  }

  getRequirements(): string[] {
    // TODO: Get requirements from BadgeService or badge model
    return [
      'Compléter au moins 5 formations',
      'Maintenir une moyenne de 4.5/5 sur les évaluations',
      'Avoir au moins 3 certifications actives'
    ];
  }

  getHowToEarnSteps(): any[] {
    return [
      {
        title: 'Compléter des formations',
        description: 'Participez et terminez des formations sur notre plateforme.'
      },
      {
        title: 'Obtenir des certifications',
        description: 'Passez et réussissez les examens de certification.'
      },
      {
        title: 'Maintenir l\'excellence',
        description: 'Conservez une moyenne élevée sur vos évaluations.'
      }
    ];
  }

  editBadge(): void {
    this.router.navigate(['/badges', this.badgeId, 'edit']);
  }

  deleteBadge(): void {
    if (!this.badge) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le badge "${this.badge.nom}" ? Cette action est irréversible.`)) {
      this.badgeService.deleteBadge(this.badgeId).subscribe({
        next: () => {
          this.router.navigate(['/badges']);
        },
        error: (error) => {
          console.error('Error deleting badge:', error);
        }
      });
    }
  }

  shareBadge(platform: string): void {
    if (!this.badge) return;

    const url = window.location.href;
    const text = `Découvrez le badge "${this.badge.nom}" sur notre plateforme !`;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  trackByEarnerId(index: number, earner: RecentEarner): number {
    return earner.id;
  }
}