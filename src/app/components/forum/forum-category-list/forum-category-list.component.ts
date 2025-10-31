import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ForumService } from '../../../services/forum.service';
import { ForumCategory } from '../../../models/forum-category.model';
import { ForumThreadCreateComponent } from '../forum-thread-create/forum-thread-create.component';
import { ForumSearchComponent } from '../forum-search/forum-search.component';
import { ForumModerationDashboardComponent } from '../forum-moderation-dashboard/forum-moderation-dashboard.component';
import { ForumReportListComponent } from '../forum-report-list/forum-report-list.component';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-forum-category-list',
  templateUrl: './forum-category-list.component.html',
  styleUrl: './forum-category-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ForumThreadCreateComponent,
    ForumSearchComponent,
    ForumModerationDashboardComponent,
    ForumReportListComponent
  ]
})
export class ForumCategoryListComponent implements OnInit {
  categories: ForumCategory[] = [];
  loading = false; // Set to false to show sample data immediately
  error: string | null = null;
  currentSection: string = 'categories';

  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {
    // Load static sample categories only
    this.loadSampleCategories();
  }

  loadSampleCategories(): void {
    this.categories = [
      {
        id: 1,
        name: 'Développement',
        description: 'Discussions sur le développement web, mobile et logiciel',
        allowAnonymous: true
      },
      {
        id: 2,
        name: 'Formations',
        description: 'Questions et retours sur les formations disponibles',
        allowAnonymous: true
      },
      {
        id: 3,
        name: 'Emploi',
        description: 'Conseils carrière, recherche d\'emploi et opportunités',
        allowAnonymous: true
      },
      {
        id: 4,
        name: 'Communauté',
        description: 'Discussions générales et échanges entre membres',
        allowAnonymous: true
      }
    ];
  }

  getCategoryIcon(category: ForumCategory): string {
    // Return different icons based on category name or id
    const icons = ['fas fa-comments', 'fas fa-question-circle', 'fas fa-lightbulb', 'fas fa-users', 'fas fa-code'];
    return icons[category.id % icons.length];
  }

  showSection(section: string): void {
    this.currentSection = section;
    // Reset to categories if invalid section
    if (!['categories', 'create-thread', 'search', 'moderation', 'reports'].includes(section)) {
      this.currentSection = 'categories';
    }
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/forum', 'category', categoryId]);
  }

  getCategoryColor(category: ForumCategory): string {
    // Return different colors for categories
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[category.id % colors.length];
  }

  navigateToCreateThread(): void {
    this.router.navigate(['/forum', 'thread', 'create']);
  }

  navigateToSearch(): void {
    this.router.navigate(['/forum', 'search']);
  }

  navigateToModeration(): void {
    this.router.navigate(['/forum', 'moderation', 'dashboard']);
  }

  navigateToReports(): void {
    this.router.navigate(['/forum', 'reports']);
  }
}
