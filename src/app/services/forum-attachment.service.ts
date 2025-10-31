import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ForumAttachment } from '../models/forum-attachment.model';

@Injectable({ providedIn: 'root' })
export class ForumAttachmentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/forum/attachment`;

  constructor(private http: HttpClient) {}

  uploadAttachment(postId: number, file: File): Observable<ForumAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ForumAttachment>(`${this.baseUrl}/upload`, formData, { params: { postId } as any });
  }

  downloadAttachment(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${filename}`, { responseType: 'blob' });
  }

  getAttachmentsForPost(postId: number): Observable<ForumAttachment[]> {
    return this.http.get<ForumAttachment[]>(`${this.baseUrl}/post/${postId}`);
  }
}