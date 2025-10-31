import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';
import { Disponibilite } from '../models/disponibilite.model';
import { Badge } from '../models/badge.model';
import { Formation } from '../models/formation.model';
import { Notification } from '../models/notification.model';
import { Recommendation } from '../models/recommendation.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/create`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Additional methods for new backend features
  getDisponibilites(userId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.baseUrl}/${userId}/disponibilites`);
  }

  addDisponibilite(userId: number, disponibilite: Partial<Disponibilite>): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(`${this.baseUrl}/${userId}/disponibilites`, disponibilite);
  }

  getBadges(userId: number): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.baseUrl}/${userId}/badges`);
  }

  getFavoriteFormations(userId: number): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/${userId}/favorite-formations`);
  }

  addFavoriteFormation(userId: number, formationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/favorite-formations/${formationId}`, {});
  }

  removeFavoriteFormation(userId: number, formationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/favorite-formations/${formationId}`);
  }

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${userId}/notifications`);
  }

  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  getRecommendations(userId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.baseUrl}/${userId}/recommendations`);
  }
}



