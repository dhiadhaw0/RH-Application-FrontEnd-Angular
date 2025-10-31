import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressionFormationService } from '../../../services/progression-formation.service';
import { FormationService } from '../../../services/formation.service';
import { ProgressionFormation } from '../../../models/progression-formation.model';
import { Formation } from '../../../models/formation.model';

@Component({
  selector: 'app-progression-dashboard',
  templateUrl: './progression-dashboard.component.html',
  styleUrls: ['./progression-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProgressionDashboardComponent implements OnInit {
  progressions: ProgressionFormation[] = [];
  formations: Formation[] = [];
  loading = false;
  userId: number = 1; // TODO: Get from authentication service

  // Statistics
  totalFormations = 0;
  completedFormations = 0;
  averageProgress = 0;
  totalTimeSpent = 0;

  constructor(
    private progressionService: ProgressionFormationService,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    // Load formations and progressions
    this.formationService.getAllFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.loadProgressions();
      },
      error: (error) => {
        console.error('Error loading formations:', error);
        this.loading = false;
      }
    });
  }

  loadProgressions(): void {
    // Load progressions for each formation
    const progressionPromises = this.formations.map(formation =>
      this.progressionService.getProgress(this.userId, formation.idFormation).toPromise()
        .catch(() => null) // Handle missing progressions
    );

    Promise.all(progressionPromises).then(progressions => {
      this.progressions = progressions.filter(p => p !== null) as ProgressionFormation[];
      this.calculateStatistics();
      this.loading = false;
    });
  }

  private calculateStatistics(): void {
    this.totalFormations = this.formations.length;
    this.completedFormations = this.progressions.filter(p => p.progression >= 100).length;
    this.averageProgress = this.progressions.length > 0
      ? Math.round(this.progressions.reduce((sum, p) => sum + p.progression, 0) / this.progressions.length)
      : 0;
    // Mock time calculation - in real app, this would come from backend
    this.totalTimeSpent = this.progressions.length * 45; // Mock 45 minutes per formation
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#27ae60';
    if (progress >= 60) return '#f39c12';
    if (progress >= 30) return '#e67e22';
    return '#e74c3c';
  }

  getProgressStatus(progress: number): string {
    if (progress >= 100) return 'Terminé';
    if (progress >= 80) return 'Presque terminé';
    if (progress >= 60) return 'En bonne voie';
    if (progress >= 30) return 'En cours';
    return 'À commencer';
  }

  getFormationProgress(formationId: number): number {
    const progression = this.progressions.find(p => p.formationId === formationId);
    return progression ? progression.progression : 0;
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }
}