import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { BadgeService } from '../../../services/badge.service';
import { Badge } from '../../../models/badge.model';

@Component({
  selector: 'app-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent]
})
export class BadgeListComponent implements OnInit {
  badges: Badge[] = [];
  filteredBadges: Badge[] = [];
  loading = false;

  searchTerm = '';
  activeFilter = 'all';

  constructor(private badgeService: BadgeService) {}

  ngOnInit(): void {
    this.loadBadges();
  }

  loadBadges(): void {
    this.loading = true;
    this.badgeService.getAllBadges().subscribe({
      next: (badges) => {
        this.badges = badges;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading badges:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.badges;

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(badge =>
        badge.nom.toLowerCase().includes(searchLower) ||
        badge.description?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter (you can extend this based on badge categories)
    switch (this.activeFilter) {
      case 'achievement':
        // Filter for achievement badges
        filtered = filtered.filter(badge => badge.nom.toLowerCase().includes('achievement'));
        break;
      case 'skill':
        // Filter for skill badges
        filtered = filtered.filter(badge => badge.nom.toLowerCase().includes('skill'));
        break;
      case 'participation':
        // Filter for participation badges
        filtered = filtered.filter(badge => badge.nom.toLowerCase().includes('participation'));
        break;
      case 'special':
        // Filter for special badges
        filtered = filtered.filter(badge => badge.nom.toLowerCase().includes('special'));
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    this.filteredBadges = filtered;
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  getTotalBadges(): number {
    return this.badges.length;
  }

  getAchievementBadges(): number {
    return this.badges.filter(badge => badge.nom.toLowerCase().includes('achievement')).length;
  }

  getSkillBadges(): number {
    return this.badges.filter(badge => badge.nom.toLowerCase().includes('skill')).length;
  }

  getParticipationBadges(): number {
    return this.badges.filter(badge => badge.nom.toLowerCase().includes('participation')).length;
  }

  getSpecialBadges(): number {
    return this.badges.filter(badge => badge.nom.toLowerCase().includes('special')).length;
  }

  deleteBadge(badge: Badge): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le badge "${badge.nom}" ?`)) {
      this.badgeService.deleteBadge(badge.id).subscribe({
        next: () => {
          this.loadBadges(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting badge:', error);
        }
      });
    }
  }

  getBadgeEarners(badge: Badge): number {
    // TODO: Implement method to get badge earners count from BadgeService
    return Math.floor(Math.random() * 100) + 1; // Mock data
  }

  getBadgeEarnedThisMonth(badge: Badge): number {
    // TODO: Implement method to get recent earners count from BadgeService
    return Math.floor(Math.random() * 20) + 1; // Mock data
  }

  trackByBadgeId(index: number, badge: Badge): number {
    return badge.id;
  }
}