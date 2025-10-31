import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { AchievementService } from '../../../services/achievement.service';
import { AuthService } from '../../../services/auth.service';
import { Achievement, AchievementCategory } from '../../../models/achievement.model';
import { UserAchievement, UserPoints } from '../../../models/user-achievement.model';
import { Badge } from '../../../models/badge.model';

@Component({
  selector: 'app-achievements-dashboard',
  standalone: false,
  templateUrl: './achievements-dashboard.component.html',
  styleUrl: './achievements-dashboard.component.scss'
})
export class AchievementsDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userPoints: UserPoints | null = null;
  userAchievements: UserAchievement[] = [];
  allAchievements: Achievement[] = [];
  availableAchievements: Achievement[] = [];
  recentAchievements: UserAchievement[] = [];
  achievementBadges: Badge[] = [];
  activeChallenges: Achievement[] = [];

  categories = AchievementCategory;
  selectedCategory: AchievementCategory = AchievementCategory.GENERAL;

  loading = false;
  currentUserId: number | null = null;

  constructor(
    private achievementService: AchievementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.loadDashboardData();
      } else {
        // Handle case when user is not authenticated
        this.currentUserId = null;
        this.userPoints = null;
        this.userAchievements = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    if (!this.currentUserId) return;

    this.loading = true;

    forkJoin({
      userPoints: this.achievementService.getUserPoints(this.currentUserId),
      userAchievements: this.achievementService.getUserAchievements(this.currentUserId),
      allAchievements: this.achievementService.getAllAchievements(),
      badges: this.achievementService.getAchievementBadges(),
      challenges: this.achievementService.getActiveChallenges()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.userPoints = data.userPoints;
        this.userAchievements = data.userAchievements;
        this.allAchievements = data.allAchievements;
        this.achievementBadges = data.badges;
        this.activeChallenges = data.challenges;

        this.filterAvailableAchievements();
        this.filterRecentAchievements();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  private filterAvailableAchievements(): void {
    const unlockedIds = this.userAchievements.map(ua => ua.achievement.id);
    this.availableAchievements = this.allAchievements.filter(
      achievement => !unlockedIds.includes(achievement.id)
    );
  }

  private filterRecentAchievements(): void {
    // Get achievements unlocked in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.recentAchievements = this.userAchievements
      .filter(ua => new Date(ua.unlockedAt) > thirtyDaysAgo)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 5);
  }

  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return this.availableAchievements.filter(a => a.category === category);
  }

  getUserAchievementById(achievementId: number): UserAchievement | undefined {
    return this.userAchievements.find(ua => ua.achievement.id === achievementId);
  }

  getProgressPercentage(achievement: Achievement): number {
    const userAchievement = this.getUserAchievementById(achievement.id);
    if (!userAchievement || !userAchievement.progress) return 0;

    return achievement.triggerValue ?
      Math.min((userAchievement.progress / achievement.triggerValue) * 100, 100) : 0;
  }

  getCategoryIcon(category: AchievementCategory): string {
    const icons = {
      [AchievementCategory.FORMATION]: 'fas fa-graduation-cap',
      [AchievementCategory.APPLICATION]: 'fas fa-file-alt',
      [AchievementCategory.MENTORSHIP]: 'fas fa-users',
      [AchievementCategory.SKILL]: 'fas fa-star',
      [AchievementCategory.COMMUNITY]: 'fas fa-comments',
      [AchievementCategory.GENERAL]: 'fas fa-trophy'
    };
    return icons[category] || 'fas fa-trophy';
  }

  getCategoryName(category: AchievementCategory): string {
    const names = {
      [AchievementCategory.FORMATION]: 'Formations',
      [AchievementCategory.APPLICATION]: 'Applications',
      [AchievementCategory.MENTORSHIP]: 'Mentorship',
      [AchievementCategory.SKILL]: 'Skills',
      [AchievementCategory.COMMUNITY]: 'Community',
      [AchievementCategory.GENERAL]: 'General'
    };
    return names[category] || 'General';
  }

  selectCategory(category: AchievementCategory): void {
    this.selectedCategory = category;
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
