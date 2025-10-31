import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ForumUpvoteService {
  private readonly baseUrl = `${environment.apiBaseUrl}/forum/upvote`;

  constructor(private http: HttpClient) {}

  upvotePost(postId: number, userId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/upvote`, null, { params: { postId, userId } as any });
  }

  countUpvotes(postId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/${postId}`);
  }

  hasUserUpvoted(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/has-upvoted`, { params: { postId, userId } as any });
  }
}