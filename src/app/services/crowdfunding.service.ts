import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  CareerGoal,
  CareerGoalCategory,
  CareerGoalStatus
} from '../models/career-goal.model';
import {
  FundingCampaign,
  CampaignStatus,
  CampaignCategory,
  ContributionTier,
  CampaignMilestone
} from '../models/funding-campaign.model';
import {
  Contribution,
  ContributionStatus,
  ContributionType
} from '../models/contribution.model';
import { DigitalWalletService } from './digital-wallet.service';

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService {
  private readonly baseUrl = `${environment.apiBaseUrl}/crowdfunding`;

  constructor(
    private http: HttpClient,
    private walletService: DigitalWalletService
  ) {}

  // Career Goals Management
  getCareerGoals(userId?: number): Observable<CareerGoal[]> {
    const params = userId ? `?userId=${userId}` : '';
    return this.http.get<CareerGoal[]>(`${this.baseUrl}/career-goals${params}`);
  }

  getCareerGoalById(id: number): Observable<CareerGoal> {
    return this.http.get<CareerGoal>(`${this.baseUrl}/career-goals/${id}`);
  }

  createCareerGoal(careerGoal: Partial<CareerGoal>): Observable<CareerGoal> {
    return this.http.post<CareerGoal>(`${this.baseUrl}/career-goals`, careerGoal);
  }

  updateCareerGoal(id: number, careerGoal: Partial<CareerGoal>): Observable<CareerGoal> {
    return this.http.put<CareerGoal>(`${this.baseUrl}/career-goals/${id}`, careerGoal);
  }

  deleteCareerGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/career-goals/${id}`);
  }

  // Funding Campaigns Management
  getFundingCampaigns(filters?: {
    category?: CampaignCategory;
    status?: CampaignStatus;
    userId?: number;
  }): Observable<FundingCampaign[]> {
    let params = '';
    if (filters) {
      const queryParams = Object.entries(filters)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      params = queryParams ? `?${queryParams}` : '';
    }
    return this.http.get<FundingCampaign[]>(`${this.baseUrl}/campaigns${params}`);
  }

  getFundingCampaignById(id: number): Observable<FundingCampaign> {
    return this.http.get<FundingCampaign>(`${this.baseUrl}/campaigns/${id}`);
  }

  createFundingCampaign(campaign: Partial<FundingCampaign>): Observable<FundingCampaign> {
    return this.http.post<FundingCampaign>(`${this.baseUrl}/campaigns`, campaign);
  }

  updateFundingCampaign(id: number, campaign: Partial<FundingCampaign>): Observable<FundingCampaign> {
    return this.http.put<FundingCampaign>(`${this.baseUrl}/campaigns/${id}`, campaign);
  }

  deleteFundingCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/campaigns/${id}`);
  }

  // Contributions Management
  getContributions(campaignId?: number, userId?: number): Observable<Contribution[]> {
    let params = '';
    if (campaignId || userId) {
      const queryParams = [];
      if (campaignId) queryParams.push(`campaignId=${campaignId}`);
      if (userId) queryParams.push(`userId=${userId}`);
      params = `?${queryParams.join('&')}`;
    }
    return this.http.get<Contribution[]>(`${this.baseUrl}/contributions${params}`);
  }

  getContributionById(id: number): Observable<Contribution> {
    return this.http.get<Contribution>(`${this.baseUrl}/contributions/${id}`);
  }

  createContribution(contribution: Partial<Contribution>): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.baseUrl}/contributions`, contribution);
  }

  // Contribution Tiers Management
  getContributionTiers(campaignId: number): Observable<ContributionTier[]> {
    return this.http.get<ContributionTier[]>(`${this.baseUrl}/campaigns/${campaignId}/tiers`);
  }

  createContributionTier(tier: Partial<ContributionTier>): Observable<ContributionTier> {
    return this.http.post<ContributionTier>(`${this.baseUrl}/tiers`, tier);
  }

  updateContributionTier(id: number, tier: Partial<ContributionTier>): Observable<ContributionTier> {
    return this.http.put<ContributionTier>(`${this.baseUrl}/tiers/${id}`, tier);
  }

  // Milestones Management
  getCampaignMilestones(campaignId: number): Observable<CampaignMilestone[]> {
    return this.http.get<CampaignMilestone[]>(`${this.baseUrl}/campaigns/${campaignId}/milestones`);
  }

  createCampaignMilestone(milestone: Partial<CampaignMilestone>): Observable<CampaignMilestone> {
    return this.http.post<CampaignMilestone>(`${this.baseUrl}/milestones`, milestone);
  }

  updateCampaignMilestone(id: number, milestone: Partial<CampaignMilestone>): Observable<CampaignMilestone> {
    return this.http.put<CampaignMilestone>(`${this.baseUrl}/milestones/${id}`, milestone);
  }

  // Payment Integration with Digital Wallet
  contributeToCampaign(
    campaignId: number,
    amount: number,
    tierId?: number,
    anonymous: boolean = false,
    message?: string
  ): Observable<Contribution> {
    const contributionData = {
      campaignId,
      amount,
      tierId,
      anonymous,
      message,
      type: ContributionType.ONE_TIME
    };

    return this.http.post<Contribution>(`${this.baseUrl}/campaigns/${campaignId}/contribute`, contributionData);
  }

  // Campaign Analytics
  getCampaignStats(campaignId: number): Observable<{
    totalContributions: number;
    totalContributors: number;
    averageContribution: number;
    progressPercentage: number;
    daysRemaining: number;
    topContributors: any[];
  }> {
    return this.http.get<any>(`${this.baseUrl}/campaigns/${campaignId}/stats`);
  }

  // Refund Management
  processRefund(contributionId: number, reason: string): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.baseUrl}/contributions/${contributionId}/refund`, { reason });
  }

  // Bulk Operations
  processFailedCampaign(campaignId: number): Observable<{ refundedContributions: number; totalRefunded: number }> {
    return this.http.post<any>(`${this.baseUrl}/campaigns/${campaignId}/process-failure`, {});
  }

  // Campaign Progress and Milestones
  updateCampaignProgress(campaignId: number): Observable<FundingCampaign> {
    return this.http.post<FundingCampaign>(`${this.baseUrl}/campaigns/${campaignId}/update-progress`, {});
  }

  checkMilestoneAchievement(campaignId: number, milestoneId: number): Observable<{ achieved: boolean; achievedAt?: string }> {
    return this.http.post<any>(`${this.baseUrl}/campaigns/${campaignId}/milestones/${milestoneId}/check`, {});
  }

  // Success/Failure Logic
  processSuccessfulCampaign(campaignId: number): Observable<{ status: string; message: string }> {
    return this.http.post<any>(`${this.baseUrl}/campaigns/${campaignId}/process-success`, {});
  }

  processExpiredCampaign(campaignId: number): Observable<{ status: string; refundedAmount: number }> {
    return this.http.post<any>(`${this.baseUrl}/campaigns/${campaignId}/process-expiry`, {});
  }

  // Automatic Campaign Management (called by cron jobs)
  checkAndUpdateCampaignStatuses(): Observable<{ updatedCampaigns: number; processedRefunds: number }> {
    return this.http.post<any>(`${this.baseUrl}/campaigns/check-statuses`, {});
  }

  // Reward Management
  getUserRewards(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/rewards`);
  }

  claimReward(contributionId: number, rewardId: number): Observable<{ status: string; message: string }> {
    return this.http.post<any>(`${this.baseUrl}/contributions/${contributionId}/rewards/${rewardId}/claim`, {});
  }

  // Enhanced Analytics
  getCampaignProgressOverTime(campaignId: number): Observable<{ date: string; amount: number; contributors: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/campaigns/${campaignId}/progress-timeline`);
  }

  getTopContributors(campaignId: number, limit: number = 10): Observable<{ userId: number; totalAmount: number; contributionCount: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/campaigns/${campaignId}/top-contributors?limit=${limit}`);
  }

  // Search and Filter
  searchCampaigns(query: string, category?: CampaignCategory): Observable<FundingCampaign[]> {
    let params = `?query=${encodeURIComponent(query)}`;
    if (category) params += `&category=${category}`;
    return this.http.get<FundingCampaign[]>(`${this.baseUrl}/campaigns/search${params}`);
  }

  // User Dashboard Data
  getUserCrowdfundingDashboard(userId: number): Observable<{
    activeCampaigns: FundingCampaign[];
    completedCampaigns: FundingCampaign[];
    contributions: Contribution[];
    totalRaised: number;
    totalContributed: number;
  }> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/dashboard`);
  }
}