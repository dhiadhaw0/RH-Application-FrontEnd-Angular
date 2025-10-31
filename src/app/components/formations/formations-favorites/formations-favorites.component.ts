import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../../services/formation.service';
import { Formation } from '../../../models/formation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formation-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formations-favorites.component.html',
  styleUrl: './formations-favorites.component.scss'
})
export class FormationFavoritesComponent implements OnInit {
  favoriteFormations: Formation[] = [];
  isLoading = true;
  userId: number = 1; // À remplacer par l'ID de l'utilisateur connecté

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFavoriteFormations();
  }

  loadFavoriteFormations(): void {
    this.isLoading = true;
    this.formationService.getFavoriteFormations(this.userId).subscribe({
      next: (formations) => {
        this.favoriteFormations = formations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations favorites:', error);
        this.isLoading = false;
      }
    });
  }

  removeFromFavorites(formationId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cette formation de vos favoris ?')) {
      this.formationService.removeFormationFromFavorites(this.userId, formationId).subscribe({
        next: () => {
          this.favoriteFormations = this.favoriteFormations.filter(f => f.idFormation !== formationId);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression des favoris:', error);
        }
      });
    }
  }

  viewDetails(formationId: number): void {
    // Navigation vers les détails de la formation
    console.log('Voir détails de la formation:', formationId);
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
           (hasHalfStar ? '☆' : '') +
           '☆'.repeat(emptyStars);
  }
}
