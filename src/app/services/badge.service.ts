import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Badge } from '../models/badge.model';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private readonly baseUrl = `${environment.apiBaseUrl}/badges`;

  constructor(private http: HttpClient) {}

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(this.baseUrl);
  }

  getBadgeById(id: number): Observable<Badge> {
    return this.http.get<Badge>(`${this.baseUrl}/${id}`);
  }

  createBadge(badge: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(this.baseUrl, badge);
  }

  deleteBadge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  assignBadgeToUser(userId: number, badgeId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/assign`, null, { params: { userId, badgeId } as any });
  }
}