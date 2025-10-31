import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Document } from '../models/document.model';
import { TypeDocument } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/documents`;

  constructor(private http: HttpClient) {}

  uploadDocument(applicationId: number, file: File, type: TypeDocument, description?: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (description) {
      formData.append('description', description);
    }

    return this.http.post<Document>(`${this.baseUrl}/upload/${applicationId}`, formData);
  }

  getDocumentsByApplication(applicationId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/application/${applicationId}`);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${documentId}`, { responseType: 'blob' });
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${documentId}`);
  }

  generateApplicationPdf(applicationId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/application/${applicationId}/pdf`, { responseType: 'blob' });
  }
}