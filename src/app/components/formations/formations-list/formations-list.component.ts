import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormationService } from '../../../services/formation.service';
import { Formation, TypeFormation, StatutFormation } from '../../../models/formation.model';

@Component({
  selector: 'app-formations-list',
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule]
})
export class FormationsListComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  loading = false;
  searchTerm = '';
  activeFilter: 'all' | 'active' | 'top-rated' | 'free' = 'all';
  categories: any[] = []; // Add missing property
  sortBy = 'date'; // Add missing property
  hasMoreFormations = false; // Add missing property

  constructor(private service: FormationService, private router: Router) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.loading = true;

    // Load static formations immediately
    const staticFormations: Formation[] = [
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
        // nombreAvis: 1250, // Property not in Formation interface
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-01'),
        // objectifs: ['Maîtriser HTML/CSS', 'Apprendre JavaScript', 'Développer avec React', 'Backend avec Node.js'], // Property not in Formation interface
        prerequis: '• Notions de base en informatique\n• Connaissances élémentaires en programmation\n• Compréhension basique des concepts informatiques\n• Motivation pour apprendre les technologies web',
        programme: 'Module 1: Introduction au développement web - HTML5 et CSS3 avancés\nModule 2: JavaScript moderne - ES6+, DOM manipulation, AJAX\nModule 3: Framework React - Composants, state, hooks, routing\nModule 4: Backend avec Node.js - Express, API REST, authentification\nModule 5: Base de données - MongoDB, modélisation, requêtes avancées\nModule 6: Déploiement et DevOps - Git, Docker, CI/CD\nModule 7: Projet final - Application web complète',
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
       // nombreAvis: 890,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-05'),
        //objectifs: ['Maîtriser Python', 'Statistiques descriptives', 'Machine Learning', 'Visualisation de données'],
        prerequis: '• Mathématiques de base (algèbre, statistiques)\n• Notions de programmation (tout langage)\n• Connaissances en Excel ou tableurs\n• Esprit analytique et curiosité intellectuelle\n• Anglais technique recommandé',
        programme: 'Module 1: Python pour la data science - NumPy, Pandas, visualisation\nModule 2: Statistiques descriptives et inférentielles\nModule 3: Machine Learning supervisé - régression, classification\nModule 4: Machine Learning non supervisé - clustering, réduction dimensionnelle\nModule 5: Deep Learning - réseaux de neurones, TensorFlow\nModule 6: Big Data - Spark, traitement de gros volumes\nModule 7: Projets pratiques - analyse de datasets réels\nModule 8: Déploiement de modèles en production',
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
       // nombreAvis: 675,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-10'),
        //objectifs: ['Principes du design UX', 'Outils de design (Figma)', 'Prototyping', 'Tests utilisateurs'],
        prerequis: '• Aucun prérequis technique spécifique\n• Intérêt pour le design et l\'expérience utilisateur\n• Créativité et sens esthétique\n• Capacité d\'analyse et d\'observation\n• Logiciel de base (traitement de texte, navigation web)',
        programme: 'Module 1: Principes fondamentaux du design UX/UI\nModule 2: Recherche utilisateur - interviews, personas, scénarios\nModule 3: Architecture de l\'information et wireframing\nModule 4: Design visuel - couleurs, typographie, iconographie\nModule 5: Outils professionnels - Figma, Sketch, Adobe XD\nModule 6: Prototyping interactif et micro-interactions\nModule 7: Tests utilisateurs et itération de design\nModule 8: Design systems et composants réutilisables\nModule 9: Projet final - redesign d\'une application complète',
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
       // nombreAvis: 543,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-08'),
       // objectifs: ['Sécurité réseau', 'Cryptographie', 'Détection d\'intrusions', 'Réponse aux incidents'],
        prerequis: '• Bases solides en réseaux informatiques\n• Connaissances générales en informatique\n• Compréhension des systèmes d\'exploitation\n• Notions de programmation (recommandé)\n• Anglais technique obligatoire\n• Certification CompTIA Security+ appréciée',
        programme: 'Module 1: Introduction à la cybersécurité et menaces actuelles\nModule 2: Sécurité des réseaux - firewall, IDS/IPS, VPN\nModule 3: Cryptographie - algorithmes, certificats, PKI\nModule 4: Sécurité des applications web et mobiles\nModule 5: Sécurité des systèmes d\'exploitation\nModule 6: Forensique numérique et investigation\nModule 7: Gestion des incidents et réponse aux attaques\nModule 8: Conformité et audit de sécurité\nModule 9: Outils avancés - SIEM, honeypots, pentesting\nModule 10: Projet final - audit de sécurité complet',
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
       // nombreAvis: 892,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-12'),
       // objectifs: ['Stratégies SEO/SEA', 'Marketing sur réseaux sociaux', 'Email marketing', 'Analytics et reporting'],
        prerequis: '• Notions de base en marketing traditionnel\n• Compréhension des réseaux sociaux\n• Maîtrise des outils bureautiques\n• Esprit commercial et créativité\n• Anglais professionnel recommandé\n• Connaissances en analyse de données appréciées',
        programme: 'Module 1: Stratégie marketing digital globale\nModule 2: SEO et référencement naturel avancé\nModule 3: SEA et publicité sur moteurs de recherche\nModule 4: Marketing sur réseaux sociaux (Facebook, Instagram, LinkedIn, TikTok)\nModule 5: Email marketing et automation\nModule 6: Content marketing et inbound marketing\nModule 7: Analytics et mesure des performances (Google Analytics, Facebook Insights)\nModule 8: E-commerce et marketing d\'influence\nModule 9: Marketing mobile et géolocalisation\nModule 10: Projet final - stratégie digitale complète pour une entreprise',
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
      //  nombreAvis: 723,
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-02-15'),
       // objectifs: ['Développement iOS', 'Développement Android', 'React Native', 'Flutter', 'Publication d\'apps'],
        prerequis: '• Bases solides en programmation orientée objet\n• Connaissances en JavaScript (pour React Native)\n• Compréhension des concepts de programmation mobile\n• Anglais technique recommandé\n• Expérience avec un IDE (Android Studio, Xcode)\n• Notions d\'architecture logicielle',
        programme: 'Module 1: Introduction au développement mobile\nModule 2: Développement iOS natif avec Swift et Xcode\nModule 3: Développement Android natif avec Kotlin et Android Studio\nModule 4: Interface utilisateur - Material Design et Human Interface Guidelines\nModule 5: Gestion des données et APIs REST\nModule 6: Frameworks hybrides - React Native et Flutter\nModule 7: Tests et débogage d\'applications mobiles\nModule 8: Performance et optimisation\nModule 9: Publication sur les stores (App Store, Google Play)\nModule 10: Monetisation et analytics\nModule 11: Projet final - application mobile complète cross-platform',
        certification: 'Oui'
      }
    ];

    this.formations = staticFormations;
    this.applyFilters();
    this.loading = false;

    // Optional: Still try to load from API in background for future data
    this.service.getAllFormations().subscribe({
      next: (formations) => {
        // Merge with static formations if API returns data
        if (formations && formations.length > 0) {
          this.formations = [...staticFormations, ...formations];
          this.applyFilters();
        }
      },
      error: (error) => {
        // Keep static formations if API fails - no error logging needed
        console.log('Using static formations (API not available)');
      }
    });
  }

  filterFormations(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFormations = [...this.formations];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredFormations = this.formations.filter(formation =>
        formation.title.toLowerCase().includes(term) ||
        formation.description?.toLowerCase().includes(term) ||
        formation.provider.toLowerCase().includes(term) ||
        formation.domaine?.toLowerCase().includes(term)
      );
    }
    this.applyActiveFilter();
  }

  searchByTitle(): void {
    if (this.searchTerm.trim()) {
      this.service.getFormationByTitre(this.searchTerm).subscribe({
        next: (formations) => {
          this.filteredFormations = formations;
          this.applyActiveFilter();
        },
        error: (error) => {
          console.error('Error searching formations by title:', error);
        }
      });
    }
  }

  searchByDescription(): void {
    if (this.searchTerm.trim()) {
      this.service.getFormationByDescription(this.searchTerm).subscribe({
        next: (formations) => {
          this.filteredFormations = formations;
          this.applyActiveFilter();
        },
        error: (error) => {
          console.error('Error searching formations by description:', error);
        }
      });
    }
  }

  filterByType(type: any): void {
    this.service.getFormationByType(type).subscribe({
      next: (formations) => {
        this.filteredFormations = formations;
        this.applyActiveFilter();
      },
      error: (error) => {
        console.error('Error filtering formations by type:', error);
      }
    });
  }

  filterByStatut(statut: any): void {
    this.service.getFormationByStatut(statut).subscribe({
      next: (formations) => {
        this.filteredFormations = formations;
        this.applyActiveFilter();
      },
      error: (error) => {
        console.error('Error filtering formations by status:', error);
      }
    });
  }

  filterByTypeAndStatut(type: any, statut: any): void {
    this.service.getFormationByTypeAndStatut(type, statut).subscribe({
      next: (formations) => {
        this.filteredFormations = formations;
        this.applyActiveFilter();
      },
      error: (error) => {
        console.error('Error filtering formations by type and status:', error);
      }
    });
  }

  filterByAverageRating(): void {
    this.service.filtrerParNoteMoyenne().subscribe({
      next: (formations) => {
        this.filteredFormations = formations;
        this.applyActiveFilter();
      },
      error: (error) => {
        console.error('Error filtering formations by average rating:', error);
      }
    });
  }

  loadTopRatedFormation(): void {
    this.service.getFormationAvecMeilleureNote().subscribe({
      next: (formation) => {
        this.filteredFormations = [formation];
      },
      error: (error) => {
        console.error('Error loading top rated formation:', error);
      }
    });
  }

  setFilter(filter: 'all' | 'active' | 'top-rated' | 'free'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filterFormations();
  }

  private applyActiveFilter(): void {
    switch (this.activeFilter) {
      case 'active':
        this.filteredFormations = this.filteredFormations.filter(f => f.active);
        break;
      case 'top-rated':
        this.filteredFormations = this.filteredFormations
          .filter(f => f.noteMoyenne && f.noteMoyenne >= 4.0)
          .sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
        break;
      case 'free':
        this.filteredFormations = this.filteredFormations.filter(f => f.prix === 0 || f.prix === null);
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }
  }

  toggleFavorite(formation: Formation): void {
    const userId = 1; // TODO: Get from authentication service
    this.service.addFormationToFavorites(userId, formation.idFormation).subscribe({
      next: () => {
        console.log('Formation added to favorites');
        // Optionally refresh the list or update UI
      },
      error: (error) => {
        console.error('Error adding formation to favorites:', error);
      }
    });
  }

  isFavorite(formation: Formation): boolean {
    // TODO: Implement proper favorite check logic with user state
    return false;
  }

  startFormation(formation: Formation): void {
    // Navigate to formation detail page to start the formation
    this.router.navigate(['/formations', formation.idFormation]);
  }

  rateFormation(formation: Formation, rating: number): void {
    if (rating >= 1 && rating <= 5) {
      this.service.submitRating(formation.idFormation, rating).subscribe({
        next: () => {
          // Refresh formations to get updated ratings
          this.loadFormations();
        },
        error: (error) => {
          console.error('Error rating formation:', error);
        }
      });
    }
  }

  sortFormations(): void {
    switch (this.sortBy) {
      case 'title':
        this.filteredFormations.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        this.filteredFormations.sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
        break;
      case 'price-low':
        this.filteredFormations.sort((a, b) => (a.prix || 0) - (b.prix || 0));
        break;
      case 'price-high':
        this.filteredFormations.sort((a, b) => (b.prix || 0) - (a.prix || 0));
        break;
      case 'newest':
        this.filteredFormations.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        break;
    }
  }

  quickView(formation: Formation): void {
    // For now, navigate to detail page. Could be enhanced with a modal later
    this.router.navigate(['/formations', formation.idFormation]);
  }

  loadMoreFormations(): void {
    // TODO: Implement pagination logic
    console.log('Loading more formations...');
    // For now, just show a message
    alert('Fonctionnalité de chargement supplémentaire à implémenter');
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterFormations();
  }

  resetFilters(): void {
    this.activeFilter = 'all';
    this.searchTerm = '';
    this.sortBy = 'title';
    this.filterFormations();
  }
}