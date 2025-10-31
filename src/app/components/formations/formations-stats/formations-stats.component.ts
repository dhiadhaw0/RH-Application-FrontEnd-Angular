import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../../services/formation.service';
import { Formation } from '../../../models/formation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formation-stats',
  standalone: true,
  templateUrl: './formations-stats.component.html',
  styleUrl: './formations-stats.component.scss',
  imports: [CommonModule, RouterModule, FormsModule]

})
export class FormationStatsComponent implements OnInit {
  stats: {
    totalFormations: number;
    nombreInscritsParFormation: Record<number, number>;
    top5Formations: Formation[];
    moyenneReussite: number;
  } = {
    totalFormations: 0,
    nombreInscritsParFormation: {},
    top5Formations: [],
    moyenneReussite: 0
  };

  isLoading = true;

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    // Charger le nombre d'inscrits par formation
    this.formationService.getNombreInscritsParFormation().subscribe({
      next: (nombreInscrits) => {
        this.stats.nombreInscritsParFormation = nombreInscrits;
        this.stats.totalFormations = Object.keys(nombreInscrits).length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques d\'inscrits:', error);
      }
    });

    // Charger le top 5 des formations
    this.formationService.getTop5Formations().subscribe({
      next: (top5Formations) => {
        this.stats.top5Formations = top5Formations;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du top 5 des formations:', error);
      }
    });

    this.isLoading = false;
  }

  getNiveauReussite(formationId: number): void {
    this.formationService.getNiveauReussite(formationId).subscribe({
      next: (niveauReussite) => {
        console.log(`Niveau de réussite pour la formation ${formationId}:`, niveauReussite);
        // TODO: Update UI with success rate
      },
      error: (error) => {
        console.error('Erreur lors du chargement du niveau de réussite:', error);
      }
    });
  }

  getTotalInscrits(): number {
    return Object.values(this.stats.nombreInscritsParFormation).reduce((sum, count) => sum + count, 0);
  }

  getFormationWithMostInscrits(): { id: number; count: number } | null {
    const entries = Object.entries(this.stats.nombreInscritsParFormation);
    if (entries.length === 0) return null;

    const [id, count] = entries.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );

    return { id: parseInt(id), count: count };
  }

  getAverageInscrits(): number {
    const total = this.getTotalInscrits();
    const count = Object.keys(this.stats.nombreInscritsParFormation).length;
    return count > 0 ? Math.round(total / count) : 0;
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
           (hasHalfStar ? '☆' : '') +
           '☆'.repeat(emptyStars);
  }

  getInscriptionsEntries(): { formationId: string; count: number }[] {
    return Object.entries(this.stats.nombreInscritsParFormation).map(([formationId, count]) => ({
      formationId,
      count
    }));
  }

  getMaxInscriptions(): number {
    const values = Object.values(this.stats.nombreInscritsParFormation);
    return values.length > 0 ? Math.max(...values) : 1;
  }
}
