import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressionFormationService } from '../../../services/progression-formation.service';
import { FormationService } from '../../../services/formation.service';
import { ProgressionFormation } from '../../../models/progression-formation.model';
import { Formation } from '../../../models/formation.model';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-progression-detail',
  templateUrl: './progression-detail.component.html',
  styleUrls: ['./progression-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],})
export class ProgressionDetailComponent implements OnInit {
  formation: Formation | null = null;
  progression: ProgressionFormation | null = null;
  loading = false;
  formationId: number = 0;
  userId: number = 1; // TODO: Get from authentication service

  // Mock modules for demonstration
  modules = [
    { id: 1, title: 'Introduction', duration: 30, completed: true, score: 85 },
    { id: 2, title: 'Concepts de base', duration: 45, completed: true, score: 92 },
    { id: 3, title: 'Pratique avancée', duration: 60, completed: false, score: 0 },
    { id: 4, title: 'Projet final', duration: 90, completed: false, score: 0 }
  ];

  get completedModulesCount(): number {
    return this.modules.filter(m => m.completed).length;
  }

  get totalDuration(): number {
    return this.getTotalDuration();
  }

  constructor(
    private route: ActivatedRoute,
    private progressionService: ProgressionFormationService,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.formationId = +params['id'];
      if (this.formationId) {
        this.loadFormationDetail();
      }
    });
  }

  loadFormationDetail(): void {
    this.loading = true;

    // Load formation details
    this.formationService.getFormationById(this.formationId).subscribe({
      next: (formation) => {
        this.formation = formation;
        this.loadProgression();
      },
      error: (error) => {
        console.error('Error loading formation:', error);
        this.loading = false;
        // Load mock formation for demo
        this.loadMockFormation();
      }
    });
  }

  loadProgression(): void {
    this.progressionService.getProgress(this.userId, this.formationId).subscribe({
      next: (progression) => {
        this.progression = progression;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading progression:', error);
        this.loading = false;
        // Load mock progression for demo
        this.loadMockProgression();
      }
    });
  }

  private loadMockFormation(): void {
    this.formation = {
      idFormation: this.formationId,
      title: 'Développement Web Full Stack',
      description: 'Maîtrisez les technologies modernes du développement web',
      provider: 'Tech Academy',
      domaine: 'Informatique',
      typeFormation: 'PDF' as any,
      prix: 299.99,
      duree: '120',
      niveau: 'INTERMEDIAIRE',
      active: true,
      noteMoyenne: 4.5
    };
    this.loadMockProgression();
  }

  private loadMockProgression(): void {
    this.progression = {
      id: 1,
      userId: this.userId,
      formationId: this.formationId,
      progression: 65,
      dateDerniereConnexion: new Date()
    };
    this.loading = false;
  }

  updateProgress(moduleId: number): void {
    // Mock progress update
    const module = this.modules.find(m => m.id === moduleId);
    if (module && !module.completed) {
      module.completed = true;
      module.score = Math.floor(Math.random() * 20) + 80; // Random score 80-100

      // Update overall progression
      if (this.progression) {
        const completedModules = this.modules.filter(m => m.completed).length;
        this.progression.progression = Math.round((completedModules / this.modules.length) * 100);
      }
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#27ae60';
    if (progress >= 60) return '#f39c12';
    if (progress >= 30) return '#e67e22';
    return '#e74c3c';
  }

  getModuleStatus(module: any): string {
    return module.completed ? 'Terminé' : 'À faire';
  }

  getTotalDuration(): number {
    return this.modules.reduce((total, module) => total + module.duration, 0);
  }

  getCompletedDuration(): number {
    return this.modules.filter(m => m.completed).reduce((total, module) => total + module.duration, 0);
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }

  goBack(): void {
    window.history.back();
  }

  trackByModuleId(index: number, module: any): number {
    return module.id;
  }
}