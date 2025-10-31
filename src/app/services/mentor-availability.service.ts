import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { MentorAvailability } from '../models/mentor-availability.model';
import { MentorshipSession } from '../models/mentorship-session.model';

@Injectable({ providedIn: 'root' })
export class MentorAvailabilityService {
  private readonly baseUrl = `${environment.apiBaseUrl}/mentorship/availability`;

  constructor(private http: HttpClient) {}

  addAvailability(mentorId: number, start: string, end: string): Observable<MentorAvailability> {
    return this.http.post<MentorAvailability>(`${this.baseUrl}/add`, null, { params: { mentorId, start, end } as any });
  }

  listAvailableSlots(mentorId: number): Observable<MentorAvailability[]> {
    return this.http.get<MentorAvailability[]>(`${this.baseUrl}/mentor/${mentorId}`);
  }

  listAllSlots(mentorId: number): Observable<MentorAvailability[]> {
    return this.http.get<MentorAvailability[]>(`${this.baseUrl}/mentor/${mentorId}/all`);
  }

  bookSlot(slotId: number, menteeId: number): Observable<MentorshipSession> {
    return this.http.post<MentorshipSession>(`${this.baseUrl}/book`, null, { params: { slotId, menteeId } as any });
  }
}