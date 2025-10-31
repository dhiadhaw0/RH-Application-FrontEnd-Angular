import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SkillAssessmentRequestDTO } from '../models/skill-assessment-request-dto.model';
import { SkillGapReportDTO } from '../models/skill-gap-report-dto.model';
import { TestEvaluation } from '../models/test-evaluation.model';

@Injectable({ providedIn: 'root' })
export class SkillAssessmentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/skills`;

  constructor(private http: HttpClient) {}

  submitSkillAssessment(dto: SkillAssessmentRequestDTO): Observable<TestEvaluation> {
    return this.http.post<TestEvaluation>(`${this.baseUrl}/assess`, dto);
  }

  getSkillGapReport(userId: number): Observable<SkillGapReportDTO> {
    return this.http.get<SkillGapReportDTO>(`${this.baseUrl}/report/${userId}`);
  }
}