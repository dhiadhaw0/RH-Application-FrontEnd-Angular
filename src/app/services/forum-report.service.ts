import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ForumReport, Status, ActionTaken } from '../models/forum-report.model';

@Injectable({ providedIn: 'root' })
export class ForumReportService {
  private readonly baseUrl = `${environment.apiBaseUrl}/forum/report`;

  constructor(private http: HttpClient) {}

  reportThread(reporterId: number, threadId: number, reason: string): Observable<ForumReport> {
    return this.http.post<ForumReport>(`${this.baseUrl}/thread`, null, { params: { reporterId, threadId, reason } as any });
  }

  reportPost(reporterId: number, postId: number, reason: string): Observable<ForumReport> {
    return this.http.post<ForumReport>(`${this.baseUrl}/post`, null, { params: { reporterId, postId, reason } as any });
  }

  listReports(status: Status): Observable<ForumReport[]> {
    return this.http.get<ForumReport[]>(`${this.baseUrl}/list`, { params: { status } as any });
  }

  moderateReport(reportId: number, moderatorId: number, moderatorComment: string, action: ActionTaken): Observable<ForumReport> {
    return this.http.post<ForumReport>(`${this.baseUrl}/moderate`, null, { params: { reportId, moderatorId, moderatorComment, action } as any });
  }
}