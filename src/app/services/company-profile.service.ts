import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CompanyProfile, EmployeeTestimonial, CompanyBenefit } from '../models/company-profile.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {
  private apiUrl = '/api/company-profiles';
  private followedCompaniesSubject = new BehaviorSubject<number[]>([]);
  public followedCompanies$ = this.followedCompaniesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFollowedCompanies();
  }

  // Company Profile CRUD operations
  getCompanyProfile(id: number): Observable<CompanyProfile> {
    return this.http.get<CompanyProfile>(`${this.apiUrl}/${id}`);
  }

  getCompanyProfiles(params?: any): Observable<CompanyProfile[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<CompanyProfile[]>(this.apiUrl, { params: httpParams });
  }

  createCompanyProfile(profile: Partial<CompanyProfile>): Observable<CompanyProfile> {
    return this.http.post<CompanyProfile>(this.apiUrl, profile);
  }

  updateCompanyProfile(id: number, profile: Partial<CompanyProfile>): Observable<CompanyProfile> {
    return this.http.put<CompanyProfile>(`${this.apiUrl}/${id}`, profile);
  }

  deleteCompanyProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Employee Testimonials
  getTestimonials(companyId: number): Observable<EmployeeTestimonial[]> {
    return this.http.get<EmployeeTestimonial[]>(`${this.apiUrl}/${companyId}/testimonials`);
  }

  addTestimonial(companyId: number, testimonial: Partial<EmployeeTestimonial>): Observable<EmployeeTestimonial> {
    return this.http.post<EmployeeTestimonial>(`${this.apiUrl}/${companyId}/testimonials`, testimonial);
  }

  updateTestimonial(companyId: number, testimonialId: number, testimonial: Partial<EmployeeTestimonial>): Observable<EmployeeTestimonial> {
    return this.http.put<EmployeeTestimonial>(`${this.apiUrl}/${companyId}/testimonials/${testimonialId}`, testimonial);
  }

  deleteTestimonial(companyId: number, testimonialId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${companyId}/testimonials/${testimonialId}`);
  }

  // Company Benefits
  getBenefits(companyId: number): Observable<CompanyBenefit[]> {
    return this.http.get<CompanyBenefit[]>(`${this.apiUrl}/${companyId}/benefits`);
  }

  addBenefit(companyId: number, benefit: Partial<CompanyBenefit>): Observable<CompanyBenefit> {
    return this.http.post<CompanyBenefit>(`${this.apiUrl}/${companyId}/benefits`, benefit);
  }

  updateBenefit(companyId: number, benefitId: number, benefit: Partial<CompanyBenefit>): Observable<CompanyBenefit> {
    return this.http.put<CompanyBenefit>(`${this.apiUrl}/${companyId}/benefits/${benefitId}`, benefit);
  }

  deleteBenefit(companyId: number, benefitId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${companyId}/benefits/${benefitId}`);
  }

  // Following functionality
  followCompany(companyId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${companyId}/follow`, {}).pipe(
      tap(() => {
        const current = this.followedCompaniesSubject.value;
        if (!current.includes(companyId)) {
          this.followedCompaniesSubject.next([...current, companyId]);
        }
      })
    );
  }

  unfollowCompany(companyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${companyId}/follow`).pipe(
      tap(() => {
        const current = this.followedCompaniesSubject.value;
        this.followedCompaniesSubject.next(current.filter(id => id !== companyId));
      })
    );
  }

  isFollowing(companyId: number): Observable<boolean> {
    return this.followedCompanies$.pipe(
      map(followed => followed.includes(companyId))
    );
  }

  private loadFollowedCompanies(): void {
    // Load from localStorage or API
    const stored = localStorage.getItem('followedCompanies');
    if (stored) {
      try {
        const followed = JSON.parse(stored);
        this.followedCompaniesSubject.next(followed);
      } catch (e) {
        console.error('Error parsing followed companies from localStorage', e);
      }
    }

    // Also fetch from API to sync
    this.http.get<number[]>(`${this.apiUrl}/followed`).subscribe({
      next: (followed) => {
        this.followedCompaniesSubject.next(followed);
        localStorage.setItem('followedCompanies', JSON.stringify(followed));
      },
      error: (error) => {
        console.error('Error loading followed companies', error);
      }
    });
  }

  // Search and comparison tools
  searchCompanies(query: string, filters?: any): Observable<CompanyProfile[]> {
    let params = new HttpParams().set('q', query);
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<CompanyProfile[]>(`${this.apiUrl}/search`, { params });
  }

  compareCompanies(companyIds: number[]): Observable<CompanyProfile[]> {
    const params = new HttpParams().set('ids', companyIds.join(','));
    return this.http.get<CompanyProfile[]>(`${this.apiUrl}/compare`, { params });
  }

  // Analytics
  getCompanyStats(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${companyId}/stats`);
  }

  getPopularCompanies(limit: number = 10): Observable<CompanyProfile[]> {
    const params = new HttpParams().set('limit', limit.toString()).set('sort', 'followers');
    return this.http.get<CompanyProfile[]>(`${this.apiUrl}/popular`, { params });
  }
}