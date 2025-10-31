import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../../services/formation.service';
import { Formation, TypeFormation, StatutFormation } from '../../../models/formation.model';
import { Certification } from '../../../models/certification.model';
import { Lecon } from '../../../models/lecon.model';
import { TraductionFormation } from '../../../models/traduction-formation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formations-detail.component.html',
  styleUrl: './formations-detail.component.scss'
})
export class FormationDetailComponent implements OnInit {
  formation: Formation | null = null;
  certifications: Certification[] = [];
  lessons: Lecon[] = [];
  traductions: TraductionFormation[] = [];
  selectedLanguage: string = 'fr';
  userRating: number = 0;
  isFavorite: boolean = false;
  userId: number = 1; // À remplacer par l'ID de l'utilisateur connecté

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
    // First try to load from API
    this.formationService.getFormationById(id).subscribe({
      next: (formation) => {
        this.formation = formation;
        this.loadCertifications(id);
        this.loadLessons(id);
        this.loadTraductions(id);
        this.checkIfFavorite(id);
      },
      error: (error) => {
        // Fallback to static data if API fails
        console.log('API not available, loading static formation data');
        this.loadStaticFormation(id);
      }
    });
  }

  private loadStaticFormation(id: number): void {
    const staticFormations = [
      {
        idFormation: 1,
        title: 'Développement Web Full Stack',
        description: 'Maîtrisez les technologies modernes du développement web : HTML, CSS, JavaScript, React, Node.js et bases de données.',
        provider: 'Tech Academy',
        domaine: 'Informatique',
        typeFormation: TypeFormation.PDF,
        prix: 299.99,
        duree: '120',
        niveau: 'INTERMEDIAIRE',
        active: true,
        noteMoyenne: 4.5,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-01'),
        prerequis: 'Notions de base en informatique, connaissances de base en programmation',
        programme: 'Module 1: HTML et CSS, Module 2: JavaScript, Module 3: React, Module 4: Node.js, Module 5: Base de données',
        certification: 'Oui'
      },
      {
        idFormation: 2,
        title: 'Data Science et Machine Learning',
        description: 'Explorez l\'univers de la data science : Python, statistiques, machine learning et visualisation de données.',
        provider: 'Data Institute',
        domaine: 'Data Science',
        typeFormation: TypeFormation.PDF,
        prix: 399.99,
        duree: '150',
        niveau: 'AVANCE',
        active: true,
        noteMoyenne: 4.7,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-05'),
        prerequis: 'Mathématiques de base, notions de programmation',
        programme: 'Module 1: Python pour la data, Module 2: Statistiques, Module 3: Machine Learning, Module 4: Deep Learning, Module 5: Projets pratiques',
        certification: 'Oui'
      },
      {
        idFormation: 3,
        title: 'Design UX/UI',
        description: 'Apprenez à créer des interfaces utilisateur intuitives et attrayantes avec les meilleures pratiques du design UX/UI.',
        provider: 'Design Studio',
        domaine: 'Design',
        typeFormation: TypeFormation.PDF,
        prix: 249.99,
        duree: '90',
        niveau: 'DEBUTANT',
        active: true,
        noteMoyenne: 4.3,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-10'),
        prerequis: 'Aucun prérequis spécifique',
        programme: 'Module 1: Introduction UX/UI, Module 2: Recherche utilisateur, Module 3: Wireframing, Module 4: Prototyping, Module 5: Tests et itération',
        certification: 'Oui'
      },
      {
        idFormation: 4,
        title: 'Cybersécurité Avancée',
        description: 'Protégez les systèmes informatiques contre les menaces modernes avec des techniques avancées de cybersécurité.',
        provider: 'Security Academy',
        domaine: 'Cybersécurité',
        typeFormation: TypeFormation.PDF,
        prix: 499.99,
        duree: '180',
        niveau: 'AVANCE',
        active: true,
        noteMoyenne: 4.6,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-08'),
        prerequis: 'Bases en réseaux, Connaissances en informatique',
        programme: 'Module 1: Sécurité des réseaux, Module 2: Cryptographie, Module 3: Sécurité des applications, Module 4: Forensics, Module 5: Gestion des incidents',
        certification: 'Oui'
      },
      {
        idFormation: 5,
        title: 'Marketing Digital',
        description: 'Maîtrisez les stratégies de marketing digital : SEO, SEA, réseaux sociaux, email marketing et analytics.',
        provider: 'Marketing Pro',
        domaine: 'Marketing',
        typeFormation: TypeFormation.PDF,
        prix: 199.99,
        duree: '100',
        niveau: 'INTERMEDIAIRE',
        active: true,
        noteMoyenne: 4.2,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-12'),
        prerequis: 'Notions de base en marketing',
        programme: 'Module 1: Stratégie digitale, Module 2: SEO et référencement, Module 3: Publicité en ligne, Module 4: Réseaux sociaux, Module 5: Mesure des performances',
        certification: 'Oui'
      },
      {
        idFormation: 6,
        title: 'Développement Mobile iOS/Android',
        description: 'Créez des applications mobiles natives pour iOS et Android avec React Native et Flutter.',
        provider: 'Mobile Academy',
        domaine: 'Développement Mobile',
        typeFormation: TypeFormation.PDF,
        active: true,
        prix: 349.99,
        duree: '140',
        niveau: 'INTERMEDIAIRE',
        noteMoyenne: 4.4,
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-02-15'),
        prerequis: 'Bases en programmation, JavaScript recommandé',
        programme: 'Module 1: Introduction mobile, Module 2: iOS avec Swift, Module 3: Android avec Kotlin, Module 4: React Native, Module 5: Flutter, Module 6: Publication',
        certification: 'Oui'
      }
    ];

    const formation = staticFormations.find(f => f.idFormation === id);
    if (formation) {
      this.formation = formation;
      this.loadCertifications(id);
      this.loadLessons(id);
      this.loadTraductions(id);
      this.checkIfFavorite(id);
    } else {
      console.error('Formation not found with ID:', id);
    }
  }

  loadCertifications(formationId: number): void {
    this.formationService.getCertifications(formationId).subscribe({
      next: (certifications) => {
        this.certifications = certifications;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des certifications:', error);
      }
    });
  }

  loadLessons(formationId: number): void {
    this.formationService.getLessons(formationId).subscribe({
      next: (lessons) => {
        this.lessons = lessons;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des leçons:', error);
      }
    });
  }

  loadTraductions(formationId: number): void {
    this.formationService.getTraductions(formationId).subscribe({
      next: (traductions) => {
        this.traductions = traductions;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des traductions:', error);
      }
    });
  }

  checkIfFavorite(formationId: number): void {
    this.formationService.getFavoriteFormations(this.userId).subscribe({
      next: (favorites) => {
        this.isFavorite = favorites.some(f => f.idFormation === formationId);
      },
      error: (error) => {
        console.error('Erreur lors de la vérification des favoris:', error);
        this.isFavorite = false;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.formation) return;

    if (this.isFavorite) {
      this.formationService.removeFormationFromFavorites(this.userId, this.formation.idFormation).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression des favoris:', error);
        }
      });
    } else {
      this.formationService.addFormationToFavorites(this.userId, this.formation.idFormation).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout aux favoris:', error);
        }
      });
    }
  }

  submitRating(): void {
    if (!this.formation || this.userRating < 1 || this.userRating > 5) return;

    this.formationService.submitRating(this.formation.idFormation, this.userRating).subscribe({
      next: (response) => {
        console.log('Note soumise avec succès:', response);
        // Recharger la formation pour mettre à jour la note moyenne
        this.loadFormation(this.formation!.idFormation);
      },
      error: (error) => {
        console.error('Erreur lors de la soumission de la note:', error);
      }
    });
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    if (this.formation) {
      this.formationService.getFormationInLangue(this.formation.idFormation, language).subscribe({
        next: (translatedFormation) => {
          // Mettre à jour l'affichage avec la traduction
          console.log('Formation traduite:', translatedFormation);
          // TODO: Update the UI with translated content
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la traduction:', error);
        }
      });
    }
  }

  addLesson(lesson: Partial<Lecon>): void {
    if (this.formation) {
      this.formationService.addLesson(this.formation.idFormation, lesson).subscribe({
        next: (newLesson) => {
          this.lessons.push(newLesson);
          console.log('Leçon ajoutée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la leçon:', error);
        }
      });
    }
  }

  updateLesson(lessonId: number, lesson: Partial<Lecon>): void {
    if (this.formation) {
      this.formationService.updateLesson(this.formation.idFormation, lessonId, lesson).subscribe({
        next: (updatedLesson) => {
          const index = this.lessons.findIndex(l => l.id === lessonId);
          if (index !== -1) {
            this.lessons[index] = updatedLesson;
          }
          console.log('Leçon mise à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la leçon:', error);
        }
      });
    }
  }

  deleteLesson(lessonId: number): void {
    if (this.formation && confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      this.formationService.deleteLesson(this.formation.idFormation, lessonId).subscribe({
        next: () => {
          this.lessons = this.lessons.filter(l => l.id !== lessonId);
          console.log('Leçon supprimée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la leçon:', error);
        }
      });
    }
  }

  getProgression(): void {
    if (this.formation) {
      this.formationService.getProgression(this.userId, this.formation.idFormation).subscribe({
        next: (progression) => {
          console.log('Progression récupérée:', progression);
          // TODO: Update UI with progression data
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de la progression:', error);
        }
      });
    }
  }

  updateProgression(progression: number): void {
    if (this.formation) {
      this.formationService.updateProgression(this.userId, this.formation.idFormation, progression).subscribe({
        next: (updatedProgression) => {
          console.log('Progression mise à jour:', updatedProgression);
          // TODO: Update UI with new progression
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la progression:', error);
        }
      });
    }
  }

  editFormation(): void {
    if (this.formation) {
      this.router.navigate(['/formations/edit', this.formation.idFormation]);
    }
  }

  navigateToRating(): void {
    if (this.formation) {
      this.router.navigate(['/formations', this.formation.idFormation, 'rating']);
    }
  }

  navigateToStats(): void {
    this.router.navigate(['/formations/stats']);
  }

  startFormation(): void {
    // TODO: Implement start formation logic - could navigate to first lesson or progress tracking
    console.log('Starting formation:', this.formation?.idFormation);
    alert('Fonctionnalité "Commencer la formation" à implémenter');
  }

  navigateToTranslation(): void {
    if (this.formation) {
      this.router.navigate(['/formations', this.formation.idFormation, 'translation']);
    }
  }

  deleteFormation(): void {
    if (this.formation && confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.deleteFormation(this.formation.idFormation).subscribe({
        next: () => {
          this.router.navigate(['/formations']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la formation:', error);
        }
      });
    }
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
            (hasHalfStar ? '☆' : '') +
            '☆'.repeat(emptyStars);
  }

  getPrerequisitesList(): string[] {
    if (!this.formation?.prerequis) return [];
    return this.formation.prerequis.split('\n').filter(item => item.trim());
  }

  getProgramModules(): string[] {
    if (!this.formation?.programme) return [];
    return this.formation.programme.split('\n').filter(item => item.trim());
  }
}
