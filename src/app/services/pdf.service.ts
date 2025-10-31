import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly baseUrl = `${environment.apiBaseUrl}/pdfs`;

  constructor(private http: HttpClient) {}

  generatePdf(applicationId: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/generate/${applicationId}`, {}, { responseType: 'blob' });
  }

  downloadPdf(applicationId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${applicationId}`, { responseType: 'blob' });
  }
}