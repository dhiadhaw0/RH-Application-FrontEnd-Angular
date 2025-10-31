import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AchievementService } from '../../../services/achievement.service';
import { AuthService } from '../../../services/auth.service';
import { UserPoints } from '../../../models/user-achievement.model';

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  leaderboard: UserPoints[] = [];
  currentUserRank: number | null = null;
  currentUserPoints: UserPoints | null = null;
  loading = false;

  constructor(
    private achievementService: AchievementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.loadLeaderboard();
      } else {
        // Handle case when user is not authenticated
        this.leaderboard = [];
        this.currentUserRank = null;
        this.currentUserPoints = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLeaderboard(): void {
    this.loading = true;

    this.achievementService.getLeaderboard(50).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.findCurrentUserRank();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.loading = false;
      }
    });
  }

  private findCurrentUserRank(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userIndex = this.leaderboard.findIndex(up => up.userId === currentUser.id);
      if (userIndex !== -1) {
        this.currentUserRank = userIndex + 1;
        this.currentUserPoints = this.leaderboard[userIndex];
      }
    }
  }

  getRankIcon(rank: number): string {
    switch (rank) {
      case 1: return 'fas fa-crown';
      case 2: return 'fas fa-medal';
      case 3: return 'fas fa-award';
      default: return 'fas fa-trophy';
    }
  }

  getRankColor(rank: number): string {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#3498db';
    }
  }

  refreshLeaderboard(): void {
    this.loadLeaderboard();
  }
}
