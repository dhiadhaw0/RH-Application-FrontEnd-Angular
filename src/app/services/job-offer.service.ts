import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JobOffer, StatutOffre } from '../models/job-offer.model';
import { JobOfferStatusHistory } from '../models/job-offer-status-history.model';
import { JobOfferVersion } from '../models/job-offer-version.model';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
  private readonly baseUrl = `${environment.apiBaseUrl}/job-offers`;

  constructor(private http: HttpClient) {}

  getAllJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/all`);
  }

  getJobOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.baseUrl}/${id}`);
  }

  createJobOffer(userId: number, jobOffer: Partial<JobOffer>): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.baseUrl}/create`, jobOffer, { params: { userId } as any });
  }

  updateJobOffer(id: number, jobOfferDetails: Partial<JobOffer>): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.baseUrl}/${id}`, jobOfferDetails);
  }

  deleteJobOffer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  updateJobOfferStatus(id: number, newStatus: StatutOffre): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.baseUrl}/${id}/status`, null, { params: { newStatus } as any });
  }

  findByTitle(title: string): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/title`, { params: { title } });
  }

  findByStatus(status: StatutOffre): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/status`, { params: { status } as any });
  }

  findByRemote(remote: boolean): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/remote`, { params: { remote } as any });
  }

  findBySalaryRange(minSalary: number, maxSalary: number): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/salary`, { params: { minSalary, maxSalary } as any });
  }

  findByUserId(userId: number): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/user/${userId}`);
  }

  findByPublishedDateBetween(startDate: string, endDate: string): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/published`, { params: { startDate, endDate } });
  }

  findByExpirationDateBetween(startDate: string, endDate: string): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/search/expiration`, { params: { startDate, endDate } });
  }

  findActiveJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/active`);
  }

  findExpiredJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.baseUrl}/expired`);
  }

  advanceWorkflowStatus(id: number): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.baseUrl}/workflow/advance/${id}`, {});
  }

  revertWorkflowStatus(id: number): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.baseUrl}/workflow/revert/${id}`, {});
  }

  getWorkflowHistory(id: number): Observable<JobOfferStatusHistory[]> {
    return this.http.get<JobOfferStatusHistory[]>(`${this.baseUrl}/workflow/history/${id}`);
  }

  getImprovementSuggestions(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suggestions/${id}`);
  }

  saveDraftOrVersion(id: number, draft: boolean = false): Observable<JobOfferVersion> {
    return this.http.post<JobOfferVersion>(`${this.baseUrl}/version/save/${id}`, null, { params: { draft } as any });
  }

  getAllVersions(id: number): Observable<JobOfferVersion[]> {
    return this.http.get<JobOfferVersion[]>(`${this.baseUrl}/version/list/${id}`);
  }

  restoreVersion(jobOfferId: number, versionId: number): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.baseUrl}/version/restore/${jobOfferId}/${versionId}`, {});
  }

  // Additional methods for new backend features
  getStatusHistory(jobOfferId: number): Observable<JobOfferStatusHistory[]> {
    return this.http.get<JobOfferStatusHistory[]>(`${this.baseUrl}/${jobOfferId}/status-history`);
  }

  getVersions(jobOfferId: number): Observable<JobOfferVersion[]> {
    return this.http.get<JobOfferVersion[]>(`${this.baseUrl}/${jobOfferId}/versions`);
  }

  createVersion(jobOfferId: number, version: Partial<JobOfferVersion>): Observable<JobOfferVersion> {
    return this.http.post<JobOfferVersion>(`${this.baseUrl}/${jobOfferId}/versions`, version);
  }
}


