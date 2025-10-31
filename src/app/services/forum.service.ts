import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ForumCategory } from '../models/forum-category.model';
import { ForumThread } from '../models/forum-thread.model';
import { ForumPost } from '../models/forum-post.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly baseUrl = `${environment.apiBaseUrl}/forum`;

  constructor(private http: HttpClient) {}

  // Categories
  listCategories(): Observable<ForumCategory[]> {
    return this.http.get<ForumCategory[]>(`${this.baseUrl}/categories`);
  }

  // Threads
  listThreads(categoryId: number): Observable<ForumThread[]> {
    return this.http.get<ForumThread[]>(`${this.baseUrl}/threads/${categoryId}`);
  }

  createThread(categoryId: number, authorId: number, title: string, content: string): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/thread`, null, { params: { categoryId, authorId, title, content } as any });
  }

  pinThread(threadId: number, pin: boolean): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/thread/${threadId}/pin`, null, { params: { pin } as any });
  }

  closeThread(threadId: number, close: boolean): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/thread/${threadId}/close`, null, { params: { close } as any });
  }

  // Posts
  listPosts(threadId: number, currentUserId: number | null): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.baseUrl}/posts/${threadId}`, { params: { currentUserId } as any });
  }

  createPost(threadId: number, authorId: number, content: string, anonymous: boolean): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.baseUrl}/post`, null, { params: { threadId, authorId, content, anonymous } as any });
  }

  updatePost(postId: number, updateData: { content: string; anonymous: boolean }): Observable<ForumPost> {
    return this.http.put<ForumPost>(`${this.baseUrl}/post/${postId}`, updateData);
  }

  markAsAnswer(postId: number, isAnswer: boolean): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.baseUrl}/post/${postId}/answer`, null, { params: { isAnswer } as any });
  }

  getUserRepo(): any {
    // This method is used in the controller, but in frontend we might not need it
    // Placeholder for now
    return null;
  }

  filterAuthorForAnonymous(post: ForumPost, currentUser: User | null): ForumPost {
    // Frontend logic to filter author if anonymous
    if (post.anonymous && (!currentUser || currentUser.id !== post.author.id)) {
      return { ...post, author: { ...post.author, firstName: 'Anonymous', lastName: '', email: '' } };
    }
    return post;
  }
}