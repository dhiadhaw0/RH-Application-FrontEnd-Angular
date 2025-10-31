import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { AchievementService } from '../../../services/achievement.service';
import { AuthService } from '../../../services/auth.service';
import { SeasonalChallenge, ChallengeProgress, ChallengeTheme } from '../../../models/seasonal-challenge.model';
import { Achievement } from '../../../models/achievement.model';

@Component({
  selector: 'app-seasonal-challenges',
  standalone: false,
  templateUrl: './seasonal-challenges.component.html',
  styleUrl: './seasonal-challenges.component.scss'
})
export class SeasonalChallengesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeChallenge: SeasonalChallenge | null = null;
  pastChallenges: SeasonalChallenge[] = [];
  challengeProgress: ChallengeProgress | null = null;
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
        this.loadChallenges();
      } else {
        // Handle case when user is not authenticated
        this.currentUserId = null;
        this.activeChallenge = null;
        this.challengeProgress = null;
        this.pastChallenges = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadChallenges(): void {
    if (!this.currentUserId) return;

    this.loading = true;

    forkJoin({
      activeChallenge: this.achievementService.getActiveSeasonalChallenge(),
      allChallenges: this.achievementService.getSeasonalChallenges()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.activeChallenge = data.activeChallenge;
        this.pastChallenges = data.allChallenges.filter(c => !c.isActive);

        if (this.activeChallenge) {
          this.loadChallengeProgress();
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
        this.loading = false;
      }
    });
  }

  private loadChallengeProgress(): void {
    if (!this.activeChallenge || !this.currentUserId) return;

    this.achievementService.getChallengeProgress(this.currentUserId, this.activeChallenge.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (progress) => {
          this.challengeProgress = progress;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading challenge progress:', error);
          this.loading = false;
        }
      });
  }

  getChallengeProgressPercentage(): number {
    if (!this.challengeProgress || !this.activeChallenge) return 0;
    return (this.challengeProgress.achievementsCompleted / this.challengeProgress.totalAchievements) * 100;
  }

  getDaysRemaining(): number {
    if (!this.activeChallenge) return 0;
    const endDate = new Date(this.activeChallenge.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getThemeColors(): { primary: string; secondary: string } {
    if (!this.activeChallenge) return { primary: '#3498db', secondary: '#2980b9' };
    return this.achievementService.getChallengeThemeColors(this.activeChallenge.theme);
  }

  getThemeIcon(): string {
    if (!this.activeChallenge) return 'fas fa-trophy';

    const icons = {
      [ChallengeTheme.WINTER]: 'fas fa-snowflake',
      [ChallengeTheme.SPRING]: 'fas fa-leaf',
      [ChallengeTheme.SUMMER]: 'fas fa-sun',
      [ChallengeTheme.AUTUMN]: 'fas fa-tree',
      [ChallengeTheme.HOLIDAY]: 'fas fa-gift',
      [ChallengeTheme.BACK_TO_SCHOOL]: 'fas fa-graduation-cap',
      [ChallengeTheme.CAREER_BOOST]: 'fas fa-rocket',
      [ChallengeTheme.SKILL_MASTER]: 'fas fa-star'
    };
    return icons[this.activeChallenge.theme] || 'fas fa-trophy';
  }

  getThemeName(): string {
    if (!this.activeChallenge) return 'Challenge';

    const names = {
      [ChallengeTheme.WINTER]: 'Winter Challenge',
      [ChallengeTheme.SPRING]: 'Spring Challenge',
      [ChallengeTheme.SUMMER]: 'Summer Challenge',
      [ChallengeTheme.AUTUMN]: 'Autumn Challenge',
      [ChallengeTheme.HOLIDAY]: 'Holiday Challenge',
      [ChallengeTheme.BACK_TO_SCHOOL]: 'Back to School',
      [ChallengeTheme.CAREER_BOOST]: 'Career Boost',
      [ChallengeTheme.SKILL_MASTER]: 'Skill Master'
    };
    return names[this.activeChallenge.theme] || 'Seasonal Challenge';
  }

  isAchievementCompleted(achievement: Achievement): boolean {
    // Mock implementation - in real app, check against user achievements
    return Math.random() > 0.7; // Random for demo
  }

  getChallengeThemeColors(theme: ChallengeTheme): { primary: string; secondary: string } {
    return this.achievementService.getChallengeThemeColors(theme);
  }

  getChallengeIcon(theme: ChallengeTheme): string {
    const icons = {
      [ChallengeTheme.WINTER]: 'fas fa-snowflake',
      [ChallengeTheme.SPRING]: 'fas fa-leaf',
      [ChallengeTheme.SUMMER]: 'fas fa-sun',
      [ChallengeTheme.AUTUMN]: 'fas fa-tree',
      [ChallengeTheme.HOLIDAY]: 'fas fa-gift',
      [ChallengeTheme.BACK_TO_SCHOOL]: 'fas fa-graduation-cap',
      [ChallengeTheme.CAREER_BOOST]: 'fas fa-rocket',
      [ChallengeTheme.SKILL_MASTER]: 'fas fa-star'
    };
    return icons[theme] || 'fas fa-trophy';
  }

  getChallengeName(theme: ChallengeTheme): string {
    const names = {
      [ChallengeTheme.WINTER]: 'Winter Challenge',
      [ChallengeTheme.SPRING]: 'Spring Challenge',
      [ChallengeTheme.SUMMER]: 'Summer Challenge',
      [ChallengeTheme.AUTUMN]: 'Autumn Challenge',
      [ChallengeTheme.HOLIDAY]: 'Holiday Challenge',
      [ChallengeTheme.BACK_TO_SCHOOL]: 'Back to School',
      [ChallengeTheme.CAREER_BOOST]: 'Career Boost',
      [ChallengeTheme.SKILL_MASTER]: 'Skill Master'
    };
    return names[theme] || 'Seasonal Challenge';
  }

  refreshData(): void {
    this.loadChallenges();
  }
}
