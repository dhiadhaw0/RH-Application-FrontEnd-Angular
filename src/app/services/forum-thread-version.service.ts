import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ForumThreadVersion } from '../models/forum-thread-version.model';
import { ForumThread } from '../models/forum-thread.model';

@Injectable({ providedIn: 'root' })
export class ForumThreadVersionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/forum/thread-version`;

  constructor(private http: HttpClient) {}

  getVersions(threadId: number): Observable<ForumThreadVersion[]> {
    return this.http.get<ForumThreadVersion[]>(`${this.baseUrl}/${threadId}`);
  }

  rollbackToVersion(threadId: number, versionNumber: number, editorId: number): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/rollback`, null, { params: { threadId, versionNumber, editorId } as any });
  }
}