import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CertificationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/certifications`;

  constructor(private http: HttpClient) {}

  generateCertification(userId: number, formationId: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/generate`, null, {
      params: { userId, formationId } as any,
      responseType: 'blob'
    });
  }
}