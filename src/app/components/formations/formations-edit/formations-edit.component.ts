import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../../services/formation.service';
import { Formation, TypeFormation, StatutFormation } from '../../../models/formation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formation-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule] ,
  templateUrl: './formations-edit.component.html',
  styleUrl: './formations-edit.component.scss'
})
export class FormationEditComponent implements OnInit {
  formation: Formation | null = null;
  originalFormation: Formation | null = null;

  typeFormationOptions = Object.values(TypeFormation);
  statutFormationOptions = Object.values(StatutFormation);
  niveauOptions = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  domaineOptions = ['Informatique', 'Marketing', 'Finance', 'Ressources Humaines', 'Design', 'Autre'];

  isSubmitting = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadFormation(+id);
    }
  }

  loadFormation(id: number): void {
    this.formationService.getFormationById(id).subscribe({
      next: (formation) => {
        this.formation = { ...formation };
        this.originalFormation = { ...formation };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la formation:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.formation || this.isSubmitting) return;

    this.isSubmitting = true;

    this.formationService.updateFormation(this.formation.idFormation, this.formation).subscribe({
      next: (updatedFormation) => {
        console.log('Formation mise à jour avec succès:', updatedFormation);
        this.router.navigate(['/formations', updatedFormation.idFormation]);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la formation:', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/formations', this.formation?.idFormation]);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.formation) !== JSON.stringify(this.originalFormation);
  }

  onTypeFormationChange(): void {
    // Logique supplémentaire si nécessaire lors du changement de type
  }

  onStatutFormationChange(): void {
    // Logique supplémentaire si nécessaire lors du changement de statut
  }
}
