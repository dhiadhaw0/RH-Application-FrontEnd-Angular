import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ProgressionFormation } from '../models/progression-formation.model';

@Injectable({ providedIn: 'root' })
export class ProgressionFormationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/progressions`;

  constructor(private http: HttpClient) {}

  updateProgress(userId: number, formationId: number, progression: number): Observable<ProgressionFormation> {
    return this.http.post<ProgressionFormation>(`${this.baseUrl}/update`, null, {
      params: { userId, formationId, progression } as any
    });
  }

  getProgress(userId: number, formationId: number): Observable<ProgressionFormation> {
    return this.http.get<ProgressionFormation>(`${this.baseUrl}/get`, {
      params: { userId, formationId } as any
    });
  }

  updateAuto(userId: number, formationId: number): Observable<ProgressionFormation> {
    return this.http.get<ProgressionFormation>(`${this.baseUrl}/auto`, {
      params: { userId, formationId } as any
    });
  }
}