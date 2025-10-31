import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';
import { MentorshipRequest } from '../models/mentorship-request.model';
import { MentorshipSession } from '../models/mentorship-session.model';

@Injectable({ providedIn: 'root' })
export class MentorshipService {
  private readonly baseUrl = `${environment.apiBaseUrl}/mentorship`;

  constructor(private http: HttpClient) {}

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
    return this.http.post<MentorshipSession>(`${this.baseUrl}/session/${sessionId}/complete`, null);
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