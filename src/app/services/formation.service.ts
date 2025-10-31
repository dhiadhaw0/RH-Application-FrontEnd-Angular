import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Formation, StatutFormation, TypeFormation } from '../models/formation.model';
import { Certification } from '../models/certification.model';
import { Lecon } from '../models/lecon.model';
import { ProgressionFormation } from '../models/progression-formation.model';
import { TraductionFormation } from '../models/traduction-formation.model';
import { InsuranceService } from './insurance.service';
import { AuthService } from './auth.service';
import { AchievementService } from './achievement.service';
import { AchievementTriggerType } from '../models/achievement.model';

@Injectable({ providedIn: 'root' })
export class FormationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/formations`;

  constructor(
    private http: HttpClient,
    private insuranceService: InsuranceService,
    private authService: AuthService,
    private achievementService: AchievementService
  ) {}

  createFormation(formation: Partial<Formation>): Observable<Formation> {
    return this.http.post<Formation>(this.baseUrl, formation);
  }

  updateFormation(id: number, formation: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.baseUrl}/${id}`, formation);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.baseUrl}/${id}`);
  }

  getAllFormations(pageable?: any): Observable<any> {
    let params = new HttpParams();
    if (pageable) {
      Object.keys(pageable).forEach(key => {
        params = params.set(key, pageable[key]);
      });
    }
    return this.http.get<any>(this.baseUrl, { params });
  }

  getFormationByTitre(titre: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/search/titre`, { params: { titre } });
  }

  getFormationByDescription(motCle: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/search/description`, { params: { motCle } });
  }

  getFormationByType(type: TypeFormation): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/search/type`, { params: { type } as any });
  }

  getFormationByStatut(statut: StatutFormation): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/search/statut`, { params: { statut } as any });
  }

  getFormationByTypeAndStatut(type: TypeFormation, statut: StatutFormation): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/search/type-statut`, { params: { type, statut } as any });
  }

  submitRating(id: number, rating: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/${id}/note`, null, { params: { note: rating } as any, responseType: 'text' });
  }

  soumettreNote(id: number, note: number): Observable<string> {
    return this.submitRating(id, note);
  }

  filtrerParNoteMoyenne(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/filtrer`);
  }

  getFormationAvecMeilleureNote(): Observable<Formation> {
    return this.http.get<Formation>(`${this.baseUrl}/top-formation`);
  }

  addFormationToFavorites(userId: number, formationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/favorites/add`, null, { params: { userId, formationId } as any });
  }

  removeFormationFromFavorites(userId: number, formationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/favorites/remove`, null, { params: { userId, formationId } as any });
  }

  getFavoriteFormations(userId: number): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/favorites`, { params: { userId } as any });
  }

  getFormationInLangue(id: number, langue: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/langue/${langue}`);
  }

  getNombreInscritsParFormation(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(`${this.baseUrl}/stats/nombre-inscrits`);
  }

  getTop5Formations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/stats/top5-formations`);
  }

  getNiveauReussite(formationId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/niveau-reussite/${formationId}`);
  }

  // Additional methods for new backend features
  getCertifications(formationId: number): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.baseUrl}/${formationId}/certifications`);
  }

  getLessons(formationId: number): Observable<Lecon[]> {
    return this.http.get<Lecon[]>(`${this.baseUrl}/${formationId}/lessons`);
  }

  addLesson(formationId: number, lesson: Partial<Lecon>): Observable<Lecon> {
    return this.http.post<Lecon>(`${this.baseUrl}/${formationId}/lessons`, lesson);
  }

  updateLesson(formationId: number, lessonId: number, lesson: Partial<Lecon>): Observable<Lecon> {
    return this.http.put<Lecon>(`${this.baseUrl}/${formationId}/lessons/${lessonId}`, lesson);
  }

  deleteLesson(formationId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${formationId}/lessons/${lessonId}`);
  }

  getProgression(userId: number, formationId: number): Observable<ProgressionFormation> {
    return this.http.get<ProgressionFormation>(`${this.baseUrl}/progression/${userId}/${formationId}`);
  }

  updateProgression(userId: number, formationId: number, progression: number): Observable<ProgressionFormation> {
    return this.http.put<ProgressionFormation>(`${this.baseUrl}/progression/${userId}/${formationId}`, { progression }).pipe(
      tap(updatedProgression => {
        // Check if formation is completed (progression === 100)
        if (updatedProgression.progression === 100) {
          this.handleFormationCompletion(userId, formationId);
          // Trigger achievement check for formation completion
          this.achievementService.checkAchievementTrigger(userId, AchievementTriggerType.FORMATION_COMPLETED).subscribe({
            next: (newAchievements) => {
              if (newAchievements.length > 0) {
                console.log('New achievements unlocked:', newAchievements);
                // Award points for formation completion
                this.achievementService.updateUserPoints(userId, 50).subscribe();
              }
            },
            error: (error) => console.error('Error checking achievements:', error)
          });
        }
      })
    );
  }

  private handleFormationCompletion(userId: number, formationId: number): void {
    // Check if formation is paid (prix > 0)
    this.getFormationById(formationId).subscribe(formation => {
      if (formation.prix && formation.prix > 0) {
        // Check if user is eligible for insurance
        this.insuranceService.isEligibleForInsurance(userId, formationId).subscribe(isEligible => {
          if (isEligible) {
            // Create insurance policy
            this.insuranceService.createInsurance(userId, formationId).subscribe({
              next: (insurance) => {
                console.log('Insurance policy created for completed formation:', insurance);
              },
              error: (error) => {
                console.error('Error creating insurance policy:', error);
              }
            });
          }
        });
      }
    });
  }

  getTraductions(formationId: number): Observable<TraductionFormation[]> {
    return this.http.get<TraductionFormation[]>(`${this.baseUrl}/${formationId}/traductions`);
  }

  addTraduction(formationId: number, traduction: Partial<TraductionFormation>): Observable<TraductionFormation> {
    return this.http.post<TraductionFormation>(`${this.baseUrl}/${formationId}/traductions`, traduction);
  }
}


