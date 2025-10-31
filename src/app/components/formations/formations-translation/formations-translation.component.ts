import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../../../services/formation.service';
import { TraductionFormation } from '../../../models/traduction-formation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formation-translation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formations-translation.component.html',
  styleUrl: './formations-translation.component.scss'
})
export class FormationTranslationComponent implements OnInit {
  formationId: number = 0;
  traductions: TraductionFormation[] = [];
  selectedTraduction: TraductionFormation | null = null;
  availableLanguages = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ru'];
  isLoading = true;
  isSubmitting = false;

  newTraduction: Partial<TraductionFormation> = {
    langue: '',
    titreTraduit: '',
    descriptionTraduite: '',
    contenuTraduit: ''
  };

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.formationId = +id;
      this.loadTraductions();
    }
  }

  loadTraductions(): void {
    this.isLoading = true;
    this.formationService.getTraductions(this.formationId).subscribe({
      next: (traductions) => {
        this.traductions = traductions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des traductions:', error);
        this.isLoading = false;
      }
    });
  }

  selectTraduction(traduction: TraductionFormation): void {
    this.selectedTraduction = traduction;
    this.newTraduction = { ...traduction };
  }

  createTraduction(): void {
    this.selectedTraduction = null;
    this.newTraduction = {
      langue: '',
      titreTraduit: '',
      descriptionTraduite: '',
      contenuTraduit: ''
    };
  }

  saveTraduction(): void {
    if (!this.newTraduction.langue || !this.newTraduction.titreTraduit) return;

    this.isSubmitting = true;

    if (this.selectedTraduction) {
      // Mise à jour d'une traduction existante
      console.log('Mise à jour de la traduction:', this.newTraduction);
      // Ici, vous devriez avoir une méthode updateTraduction dans le service
      this.isSubmitting = false;
    } else {
      // Création d'une nouvelle traduction
      const traductionToCreate: Partial<TraductionFormation> = {
        ...this.newTraduction,
        formation: { idFormation: this.formationId } as any
      };

      this.formationService.addTraduction(this.formationId, traductionToCreate).subscribe({
        next: (createdTraduction) => {
          console.log('Traduction créée avec succès:', createdTraduction);
          this.traductions.push(createdTraduction);
          this.cancelEdit();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création de la traduction:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteTraduction(traduction: TraductionFormation): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la traduction en ${traduction.langue} ?`)) {
      // TODO: Implement deleteTraduction method in service
      console.log('Suppression de la traduction:', traduction);
      this.traductions = this.traductions.filter(t => t.id !== traduction.id);
    }
  }

  updateTraduction(traduction: TraductionFormation): void {
    // TODO: Implement updateTraduction method in service
    console.log('Mise à jour de la traduction:', traduction);
  }

  cancelEdit(): void {
    this.selectedTraduction = null;
    this.newTraduction = {
      langue: '',
      titreTraduit: '',
      descriptionTraduite: '',
      contenuTraduit: ''
    };
  }

  getAvailableLanguages(): string[] {
    const usedLanguages = this.traductions.map(t => t.langue);
    return this.availableLanguages.filter(lang => !usedLanguages.includes(lang));
  }

  getLanguageName(code: string): string {
    const languages: { [key: string]: string } = {
      'fr': 'Français',
      'en': 'English',
      'es': 'Español',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'ar': 'العربية',
      'zh': '中文',
      'ja': '日本語',
      'ru': 'Русский'
    };
    return languages[code] || code;
  }
}
