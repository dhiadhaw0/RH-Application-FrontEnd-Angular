import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Achievement, AchievementCategory, AchievementTriggerType } from '../models/achievement.model';
import { UserAchievement, UserPoints } from '../models/user-achievement.model';
import { Badge } from '../models/badge.model';
import { SeasonalChallenge, ChallengeProgress, ChallengeTheme } from '../models/seasonal-challenge.model';

@Injectable({ providedIn: 'root' })
export class AchievementService {
  private readonly baseUrl = `${environment.apiBaseUrl}/achievements`;
  private userPointsSubject = new BehaviorSubject<UserPoints | null>(null);
  public userPoints$ = this.userPointsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Achievement CRUD operations
  getAllAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.baseUrl);
  }

  getAchievementById(id: number): Observable<Achievement> {
    return this.http.get<Achievement>(`${this.baseUrl}/${id}`);
  }

  createAchievement(achievement: Partial<Achievement>): Observable<Achievement> {
    return this.http.post<Achievement>(this.baseUrl, achievement);
  }

  updateAchievement(id: number, achievement: Partial<Achievement>): Observable<Achievement> {
    return this.http.put<Achievement>(`${this.baseUrl}/${id}`, achievement);
  }

  deleteAchievement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // User Achievement operations
  getUserAchievements(userId: number): Observable<UserAchievement[]> {
    return this.http.get<UserAchievement[]>(`${this.baseUrl}/user/${userId}`);
  }

  unlockAchievement(userId: number, achievementId: number): Observable<UserAchievement> {
    return this.http.post<UserAchievement>(`${this.baseUrl}/unlock`, { userId, achievementId });
  }

  // Points system
  getUserPoints(userId: number): Observable<UserPoints> {
    return this.http.get<UserPoints>(`${this.baseUrl}/points/${userId}`);
  }

  updateUserPoints(userId: number, points: number): Observable<UserPoints> {
    return this.http.post<UserPoints>(`${this.baseUrl}/points/add`, { userId, points });
  }

  // Leaderboard
  getLeaderboard(limit: number = 50): Observable<UserPoints[]> {
    return this.http.get<UserPoints[]>(`${this.baseUrl}/leaderboard?limit=${limit}`);
  }

  // Achievement triggers
  checkAchievementTrigger(userId: number, triggerType: AchievementTriggerType, triggerValue?: number): Observable<UserAchievement[]> {
    return this.http.post<UserAchievement[]>(`${this.baseUrl}/check-trigger`, {
      userId,
      triggerType,
      triggerValue
    });
  }

  // Badge integration
  getAchievementBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.baseUrl}/badges`);
  }

  // Seasonal challenges
  getActiveChallenges(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.baseUrl}/challenges/active`);
  }

  getSeasonalChallenges(): Observable<SeasonalChallenge[]> {
    return this.http.get<SeasonalChallenge[]>(`${this.baseUrl}/seasonal-challenges`);
  }

  getActiveSeasonalChallenge(): Observable<SeasonalChallenge | null> {
    return this.http.get<SeasonalChallenge | null>(`${this.baseUrl}/seasonal-challenges/active`);
  }

  getChallengeProgress(userId: number, challengeId: number): Observable<ChallengeProgress> {
    return this.http.get<ChallengeProgress>(`${this.baseUrl}/seasonal-challenges/${challengeId}/progress/${userId}`);
  }

  // Enhanced point calculation with seasonal bonuses
  calculatePointsWithBonus(basePoints: number, isChallengePeriod: boolean = false, multiplier: number = 1): number {
    if (isChallengePeriod) {
      return Math.floor(basePoints * multiplier);
    }
    return basePoints;
  }

  // Check if current date is within a challenge period
  isChallengePeriod(challenge: SeasonalChallenge): boolean {
    const now = new Date();
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    return now >= start && now <= end;
  }

  // Get challenge theme colors
  getChallengeThemeColors(theme: ChallengeTheme): { primary: string; secondary: string } {
    const themes = {
      [ChallengeTheme.WINTER]: { primary: '#3498db', secondary: '#2980b9' },
      [ChallengeTheme.SPRING]: { primary: '#27ae60', secondary: '#2ecc71' },
      [ChallengeTheme.SUMMER]: { primary: '#f39c12', secondary: '#e67e22' },
      [ChallengeTheme.AUTUMN]: { primary: '#e74c3c', secondary: '#c0392b' },
      [ChallengeTheme.HOLIDAY]: { primary: '#9b59b6', secondary: '#8e44ad' },
      [ChallengeTheme.BACK_TO_SCHOOL]: { primary: '#1abc9c', secondary: '#16a085' },
      [ChallengeTheme.CAREER_BOOST]: { primary: '#34495e', secondary: '#2c3e50' },
      [ChallengeTheme.SKILL_MASTER]: { primary: '#f1c40f', secondary: '#f39c12' }
    };
    return themes[theme] || themes[ChallengeTheme.WINTER];
  }

  // Utility methods
  calculateLevel(points: number): number {
    return Math.floor(points / 1000) + 1;
  }

  getNextLevelThreshold(currentLevel: number): number {
    return currentLevel * 1000;
  }

  // Local state management
  setUserPoints(points: UserPoints): void {
    this.userPointsSubject.next(points);
  }

  clearUserPoints(): void {
    this.userPointsSubject.next(null);
  }
}