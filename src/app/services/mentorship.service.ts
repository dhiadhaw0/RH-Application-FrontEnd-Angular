import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';
import { MentorshipRequest } from '../models/mentorship-request.model';
import { MentorshipSession } from '../models/mentorship-session.model';
import { AchievementService } from './achievement.service';
import { AchievementTriggerType } from '../models/achievement.model';

@Injectable({ providedIn: 'root' })
export class MentorshipService {
  private readonly baseUrl = `${environment.apiBaseUrl}/mentorship`;

  constructor(
    private http: HttpClient,
    private achievementService: AchievementService
  ) {}

  listMentors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/mentors`);
  }

  requestMentorship(menteeId: number, mentorId: number | null, topic: string, message: string): Observable<MentorshipRequest> {
    return this.http.post<MentorshipRequest>(`${this.baseUrl}/request`, null, { params: { menteeId, mentorId, topic, message } as any });
  }

  getRequestsForMentor(mentorId: number): Observable<MentorshipRequest[]> {
    return this.http.get<MentorshipRequest[]>(`${this.baseUrl}/requests/mentor/${mentorId}`);
  }

  respondToRequest(requestId: number, accept: boolean): Observable<MentorshipRequest> {
    return this.http.post<MentorshipRequest>(`${this.baseUrl}/request/${requestId}/respond`, null, { params: { accept } as any });
  }

  scheduleSession(requestId: number, scheduledAt: string, durationMinutes: number, location: string, agenda: string | null): Observable<MentorshipSession> {
    return this.http.post<MentorshipSession>(`${this.baseUrl}/session/schedule`, null, { params: { requestId, scheduledAt, durationMinutes, location, agenda } as any });
  }

  getSessionsForUser(userId: number): Observable<MentorshipSession[]> {
    return this.http.get<MentorshipSession[]>(`${this.baseUrl}/sessions/user/${userId}`);
  }

  completeSession(sessionId: number): Observable<MentorshipSession> {
    return this.http.post<MentorshipSession>(`${this.baseUrl}/session/${sessionId}/complete`, null).pipe(
      tap(completedSession => {
        // Trigger achievement check for mentorship session completion
        if (completedSession.mentorshipRequest?.mentee?.id) {
          this.achievementService.checkAchievementTrigger(completedSession.mentorshipRequest.mentee.id, AchievementTriggerType.MENTORSHIP_SESSION_COMPLETED).subscribe({
            next: (newAchievements) => {
              if (newAchievements.length > 0) {
                console.log('New achievements unlocked:', newAchievements);
                // Award points for mentorship session completion
                this.achievementService.updateUserPoints(completedSession.mentorshipRequest.mentee.id, 30).subscribe();
              }
            },
            error: (error) => console.error('Error checking achievements:', error)
          });
        }
        // Also check for mentor achievements
        if (completedSession.mentorshipRequest?.mentor?.id) {
          this.achievementService.checkAchievementTrigger(completedSession.mentorshipRequest.mentor.id, AchievementTriggerType.MENTORSHIP_SESSION_COMPLETED).subscribe({
            next: (newAchievements) => {
              if (newAchievements.length > 0) {
                console.log('Mentor achievements unlocked:', newAchievements);
                // Award points for mentoring
                this.achievementService.updateUserPoints(completedSession.mentorshipRequest.mentor.id, 35).subscribe();
              }
            },
            error: (error) => console.error('Error checking mentor achievements:', error)
          });
        }
      })
    );
  }

  searchMentors(expertise: string | null, language: string | null): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/mentors/search`, { params: { expertise, language } as any });
  }

  getMentorBadge(mentorId: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/mentor/${mentorId}/badge`);
  }

  getMentorProfile(mentorId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/mentor/${mentorId}/profile`);
  }

  addMentorNotes(sessionId: number, notes: string): Observable<MentorshipSession> {
    return this.http.post<MentorshipSession>(`${this.baseUrl}/session/${sessionId}/mentor-notes`, null, { params: { notes } as any });
  }

  addMenteeNotes(sessionId: number, notes: string): Observable<MentorshipSession> {
    return this.http.post<MentorshipSession>(`${this.baseUrl}/session/${sessionId}/mentee-notes`, null, { params: { notes } as any });
  }
}