import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ForumPostVersion } from '../models/forum-post-version.model';
import { ForumPost } from '../models/forum-post.model';

@Injectable({ providedIn: 'root' })
export class ForumPostVersionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/forum/post-version`;

  constructor(private http: HttpClient) {}

  getVersions(postId: number): Observable<ForumPostVersion[]> {
    return this.http.get<ForumPostVersion[]>(`${this.baseUrl}/${postId}`);
  }

  rollbackToVersion(postId: number, versionNumber: number, editorId: number): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.baseUrl}/rollback`, null, { params: { postId, versionNumber, editorId } as any });
  }
}