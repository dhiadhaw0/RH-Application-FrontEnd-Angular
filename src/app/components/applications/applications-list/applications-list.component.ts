import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ApplicationService } from '../../../services/application.service';
import { Application, StatutCandidature } from '../../../models/application.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule]
})
export class ApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading = false;

  // Filters
  searchTerm = '';
  filterStatus = '';
  filterUserId = '';
  filterJobOfferId = '';
  filterMinScore = '';

  // Statistics
  totalApplications = 0;
  avgRelevance: number | null = null;
  countsByStatus: { status: string; count: number }[] = [];
  chartMode: 'donut' | 'bar' = 'donut';

  // Chart data
  doughnutData: any;
  doughnutOptions: any;
  barData: any;
  barOptions: any;

  statusOptions = Object.values(StatutCandidature);

  // Static mock data
  private mockApplications: Application[] = [
    {
      idApplication: 1,
      user: 1,
      jobOffer: 1,
      status: StatutCandidature.EN_ATTENTE,
      relevanceScore: 8.5,
      scoreIA: 8.2,
      motivationLetter: "Je suis très intéressé par ce poste car il correspond parfaitement à mes compétences en développement web. Avec 3 ans d'expérience en Angular et React, je suis convaincu de pouvoir apporter une réelle valeur ajoutée à votre équipe.",
      coverLetter: "Madame, Monsieur, Je me permets de vous présenter ma candidature pour le poste de Développeur Frontend...",
      aiRelevanceReport: "Candidature très pertinente. Le candidat possède les compétences techniques requises et montre un réel intérêt pour le poste. Score élevé en analyse comportementale.",
      createdAt: new Date('2024-01-15')
    },
    {
      idApplication: 2,
      user: 2,
      jobOffer: 2,
      status: StatutCandidature.ACCEPTEE,
      relevanceScore: 9.1,
      scoreIA: 9.0,
      motivationLetter: "Passionnée par l'intelligence artificielle, je souhaite intégrer votre équipe pour contribuer à des projets innovants. Ma maîtrise des algorithmes de machine learning et mon expérience en Python me permettront de relever les défis techniques.",
      coverLetter: "Cher recruteur, Diplômée en informatique avec spécialisation IA...",
      aiRelevanceReport: "Excellente correspondance. Profil technique exceptionnel avec expérience pertinente. Candidat hautement recommandé pour un entretien.",
      createdAt: new Date('2024-01-12')
    },
    {
      idApplication: 3,
      user: 3,
      jobOffer: 3,
      status: StatutCandidature.REFUSEE,
      relevanceScore: 6.2,
      scoreIA: 5.8,
      motivationLetter: "Je recherche une opportunité dans le domaine du marketing digital. Mes compétences en gestion de projet et analyse de données pourraient être utiles à votre entreprise.",
      coverLetter: "Bonjour, Je suis intéressé par votre offre de Chef de Projet...",
      aiRelevanceReport: "Correspondance moyenne. Le candidat manque d'expérience spécifique dans le domaine demandé. Recommandation d'entretien non prioritaire.",
      createdAt: new Date('2024-01-10')
    },
    {
      idApplication: 4,
      user: 4,
      jobOffer: 1,
      status: StatutCandidature.EN_ATTENTE,
      relevanceScore: 7.8,
      scoreIA: 7.5,
      motivationLetter: "Développeur full-stack avec 5 ans d'expérience, je suis enthousiaste à l'idée de rejoindre votre équipe. Mes compétences en Node.js, React et bases de données relationnelles feront de moi un atout pour vos projets.",
      coverLetter: "Monsieur, Je souhaite candidater pour le poste de Développeur Full-Stack...",
      aiRelevanceReport: "Bonne correspondance technique. Expérience solide dans les technologies demandées. Profil à considérer pour un entretien technique.",
      createdAt: new Date('2024-01-08')
    },
    {
      idApplication: 5,
      user: 5,
      jobOffer: 4,
      status: StatutCandidature.ACCEPTEE,
      relevanceScore: 8.9,
      scoreIA: 8.7,
      motivationLetter: "Designer UX/UI avec portfolio reconnu, je suis ravi de postuler pour ce poste. Mon approche centrée utilisateur et mes compétences en Figma, Sketch et prototyping me permettront de créer des expériences exceptionnelles.",
      coverLetter: "Chère équipe, Passionnée par le design d'interface...",
      aiRelevanceReport: "Excellent profil créatif. Portfolio et compétences parfaitement alignés avec les besoins. Candidat prioritaire pour l'entretien.",
      createdAt: new Date('2024-01-05')
    },
    {
      idApplication: 6,
      user: 6,
      jobOffer: 2,
      status: StatutCandidature.EN_ATTENTE,
      relevanceScore: 7.2,
      scoreIA: 7.0,
      motivationLetter: "Data Scientist avec expertise en analyse prédictive, je suis intéressé par les défis techniques de votre entreprise. Ma maîtrise de Python, R et des algorithmes de ML me permettra de contribuer efficacement.",
      coverLetter: "Madame, Monsieur, Je candidate pour le poste de Data Scientist...",
      aiRelevanceReport: "Bon profil technique. Compétences en data science pertinentes mais expérience limitée dans l'environnement demandé.",
      createdAt: new Date('2024-01-03')
    }
  ];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    // Use static mock data instead of API call
    this.applications = [...this.mockApplications];
    this.filteredApplications = [...this.applications];
    this.calculateStatistics();
    this.updateCharts();
  }

  applyFilters(): void {
    let params: any = {};

    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterUserId) params.userId = parseInt(this.filterUserId);
    if (this.filterJobOfferId) params.jobOfferId = parseInt(this.filterJobOfferId);
    if (this.filterMinScore) params.minScore = parseFloat(this.filterMinScore);

    this.loading = true;
    this.applicationService.getApplicationsWithFilters(params).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.calculateStatistics();
        this.updateCharts();
      },
      error: (error) => {
        console.error('Error filtering applications:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  setFilter(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterUserId = '';
    this.filterJobOfferId = '';
    this.filterMinScore = '';
    this.loadApplications();
  }

  calculateStatistics(): void {
    this.totalApplications = this.applications.length;

    const scores = this.applications
      .map(app => app.relevanceScore || app.scoreIA)
      .filter(score => score != null) as number[];

    this.avgRelevance = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null;

    // Count by status
    const statusCount: { [key: string]: number } = {};
    this.applications.forEach(app => {
      statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });

    this.countsByStatus = Object.entries(statusCount).map(([status, count]) => ({
      status,
      count
    }));
  }

  updateCharts(): void {
    if (this.countsByStatus.length === 0) return;

    const labels = this.countsByStatus.map(item => item.status);
    const data = this.countsByStatus.map(item => item.count);

    // Colors for different statuses
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    // Doughnut chart
    this.doughnutData = {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        hoverBackgroundColor: backgroundColors.slice(0, labels.length)
      }]
    };

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    };

    // Bar chart
    this.barData = {
      labels,
      datasets: [{
        label: 'Nombre de candidatures',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length).map(color => color + '80'),
        borderColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1
      }]
    };

    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  }

  setChartMode(mode: 'donut' | 'bar'): void {
    this.chartMode = mode;
  }

  generateReport(applicationId: number): void {
    this.applicationService.generateReport(applicationId).subscribe({
      next: (application) => {
        // TODO: Handle report generation (download PDF or show modal)
        console.log('Report generated for application:', applicationId);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }

  viewApplicationDetails(application: Application): void {
    // TODO: Navigate to application detail page
    console.log('View application details:', application.idApplication);
  }

  editApplication(application: Application): void {
    // TODO: Navigate to application edit page
    console.log('Edit application:', application.idApplication);
  }

  deleteApplication(application: Application): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette candidature ?`)) {
      this.applicationService.deleteApplication(application.idApplication).subscribe({
        next: () => {
          this.loadApplications(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting application:', error);
        }
      });
    }
  }

  exportApplications(): void {
    // Implement export functionality
    const csvData = this.applications.map(app => ({
      'ID Candidature': app.idApplication,
      'Utilisateur': app.user,
      'Offre': app.jobOffer,
      'Statut': app.status,
      'Score Pertinence': app.relevanceScore || '',
      'Score IA': app.scoreIA || '',
      'Date Création': app.createdAt ? new Date(app.createdAt).toLocaleDateString('fr-FR') : ''
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidatures_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  trackByApplicationId(index: number, application: Application): number {
    return application.idApplication;
  }

  getScoreLevel(score: number): string {
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    if (score >= 4) return 'average';
    return 'poor';
  }

  getAIInsights(application: Application): string[] {
    const insights: string[] = [];
    if (application.relevanceScore && application.relevanceScore >= 8) {
      insights.push('Excellente correspondance avec le poste');
    }
    if (application.scoreIA && application.scoreIA >= 7) {
      insights.push('Profil très prometteur selon l\'IA');
    }
    if (application.motivationLetter && application.motivationLetter.length > 200) {
      insights.push('Lettre de motivation détaillée');
    }
    return insights;
  }

  viewFullMotivation(application: Application): void {
    // TODO: Implement modal or expand functionality
    console.log('View full motivation for application:', application.idApplication);
  }

  bulkUpdateStatus(newStatus: StatutCandidature): void {
    // TODO: Implement bulk status update
    console.log('Bulk update status to:', newStatus);
  }
}