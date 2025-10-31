import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Application, StatutCandidature } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/applications`;

  constructor(private http: HttpClient) {}

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.baseUrl);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/${id}`);
  }

  createApplication(jobOfferId: number, application: Partial<Application>): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/create`, application, { params: { jobOfferId } as any });
  }

  updateApplication(id: number, application: Partial<Application>): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/${id}`, application);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getApplicationsByUser(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/user/${userId}`);
  }

  getApplicationsByJobOffer(jobOfferId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/job-offer/${jobOfferId}`);
  }

  updateApplicationStatus(applicationId: number, status: StatutCandidature): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/${applicationId}/status`, null, { params: { status } as any });
  }

  generateReport(id: number): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/${id}/generate-report`, {});
  }

  getApplicationsWithFilters(params: any): Observable<Application[]> {
    let httpParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams.set(key, params[key].toString());
      }
    });
    return this.http.get<Application[]>(this.baseUrl, { params: httpParams as any });
  }

  getApplicationsByStatus(status: StatutCandidature): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/status/${status}`);
  }

  getApplicationsByRelevanceScoreGreaterThan(minScore: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/relevance-score/${minScore}`);
  }

  getApplicationTimeline(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/timeline`);
  }
}
