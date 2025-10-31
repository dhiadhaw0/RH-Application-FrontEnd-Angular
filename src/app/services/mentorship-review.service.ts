import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { MentorshipReview } from '../models/mentorship-review.model';

@Injectable({ providedIn: 'root' })
export class MentorshipReviewService {
  private readonly baseUrl = `${environment.apiBaseUrl}/mentorship/review`;

  constructor(private http: HttpClient) {}

  submitReview(sessionId: number, reviewerId: number, rating: number, comment: string): Observable<MentorshipReview> {
    return this.http.post<MentorshipReview>(`${this.baseUrl}/submit`, null, { params: { sessionId, reviewerId, rating, comment } as any });
  }

  getReviewsForMentor(mentorId: number): Observable<MentorshipReview[]> {
    return this.http.get<MentorshipReview[]>(`${this.baseUrl}/mentor/${mentorId}`);
  }

  getReviewsForSession(sessionId: number): Observable<MentorshipReview[]> {
    return this.http.get<MentorshipReview[]>(`${this.baseUrl}/session/${sessionId}`);
  }

  getReviewsByUser(userId: number): Observable<MentorshipReview[]> {
    return this.http.get<MentorshipReview[]>(`${this.baseUrl}/user/${userId}`);
  }

  hasUserReviewedSession(sessionId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/session/${sessionId}/user/${userId}/has-reviewed`);
  }
}