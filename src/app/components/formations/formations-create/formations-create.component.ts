import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormationService } from '../../../services/formation.service';
import { Formation, TypeFormation, StatutFormation } from '../../../models/formation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
@Component({
  selector: 'app-formation-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './formations-create.component.html',
  styleUrl: './formations-create.component.scss'
})
export class FormationCreateComponent {
  formation: Partial<Formation> = {
    title: '',
    description: '',
    niveau: '',
    domaine: '',
    duree: '',
    lieu: '',
    prix: 0,
    prerequis: '',
    programme: '',
    provider: '',
    certification: '',
    typeFormation: TypeFormation.VIDEO,
    statutFormation: StatutFormation.EN_COURS,
    active: true
  };

  typeFormationOptions = Object.values(TypeFormation);
  statutFormationOptions = Object.values(StatutFormation);
  niveauOptions = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  domaineOptions = ['Informatique', 'Marketing', 'Finance', 'Ressources Humaines', 'Design', 'Autre'];

  isSubmitting = false;

  constructor(
    private formationService: FormationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    this.formationService.createFormation(this.formation).subscribe({
      next: (createdFormation) => {
        console.log('Formation créée avec succès:', createdFormation);
        this.router.navigate(['/formations', createdFormation.idFormation]);
      },
      error: (error) => {
        console.error('Erreur lors de la création de la formation:', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/formations']);
  }

  onTypeFormationChange(): void {
    // Logique supplémentaire si nécessaire lors du changement de type
  }

  onStatutFormationChange(): void {
    // Logique supplémentaire si nécessaire lors du changement de statut
  }
}
