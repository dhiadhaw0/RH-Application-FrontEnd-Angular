import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumThread } from '../../../models/forum-thread.model';
import { ForumPost } from '../../../models/forum-post.model';
import { CommonModule } from '@angular/common';

interface SearchResult {
  threads: ForumThread[];
  posts: ForumPost[];
  users: any[];
}

@Component({
  selector: 'app-forum-search',
  templateUrl: './forum-search.component.html',
  styleUrl: './forum-search.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForumSearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: SearchResult | null = null;
  loading = false;
  error: string | null = null;
  searchQuery = '';
  activeTab: 'threads' | 'posts' | 'users' = 'threads';

  showFilters = false;

  searchFilters = {
    category: '',
    dateRange: '',
    author: '',
    sortBy: 'relevance'
  };

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      dateRange: [''],
      author: [''],
      sortBy: ['relevance']
    });
  }

  ngOnInit(): void {
    // Check for query parameter
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchForm.patchValue({ query: params['q'] });
        this.performSearch(params['q']);
      }
    });
  }

  onSearch(): void {
    const query = this.searchForm.value.query?.trim();
    if (query) {
      this.searchQuery = query;
      this.performSearch(query);
      // Update URL
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: query },
        queryParamsHandling: 'merge'
      });
    }
  }

  performSearch(query: string): void {
    this.loading = true;
    this.error = null;

    // Simulate search API call
    setTimeout(() => {
      this.searchResults = this.generateMockResults(query);
      this.loading = false;
    }, 1000);
  }

  private generateMockResults(query: string): SearchResult {
    // Mock search results
    const mockThreads: ForumThread[] = [
      {
        id: 1,
        title: `Discussion sur ${query}`,
        content: `Contenu de discussion concernant ${query}...`,
        author: {
          id: 1,
          firstName: 'Alice',
          lastName: 'Martin',
          email: 'alice@example.com',
          dateOfBirth: new Date('1990-01-01'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        category: {
          id: 1,
          name: 'General',
          allowAnonymous: false
        },
        createdAt: new Date(),
        isPinned: false,
        isClosed: false
      },
      {
        id: 2,
        title: `Guide complet pour ${query}`,
        content: `Un guide détaillé sur ${query} avec exemples pratiques.`,
        author: {
          id: 3,
          firstName: 'Charlie',
          lastName: 'Brown',
          email: 'charlie@example.com',
          dateOfBirth: new Date('1988-03-20'),
          createdAt: new Date(),
          isMentor: true,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        category: {
          id: 2,
          name: 'Technologie',
          allowAnonymous: false
        },
        createdAt: new Date(Date.now() - 86400000),
        isPinned: true,
        isClosed: false
      }
    ];

    const mockPosts: ForumPost[] = [
      {
        id: 1,
        thread: { id: 1, title: `Discussion sur ${query}` } as any,
        author: {
          id: 2,
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@example.com',
          dateOfBirth: new Date('1985-05-15'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        content: `Post concernant ${query} avec du contenu pertinent.`,
        createdAt: new Date(),
        isAnswer: false,
        anonymous: false
      },
      {
        id: 2,
        thread: { id: 2, title: `Guide complet pour ${query}` } as any,
        author: {
          id: 4,
          firstName: 'Diana',
          lastName: 'Prince',
          email: 'diana@example.com',
          dateOfBirth: new Date('1992-07-10'),
          createdAt: new Date(),
          isMentor: false,
          banned: false,
          isModerator: false,
          role: 'USER' as any
        },
        content: `Excellente ressource sur ${query}! Merci pour le partage.`,
        createdAt: new Date(Date.now() - 3600000),
        isAnswer: true,
        anonymous: false
      }
    ];

    const mockUsers: any[] = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@example.com',
        role: 'USER',
        createdAt: new Date('2023-01-15'),
        isMentor: false,
        banned: false,
        isModerator: false
      },
      {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@example.com',
        role: 'MODERATOR',
        createdAt: new Date('2022-11-20'),
        isMentor: true,
        banned: false,
        isModerator: true
      }
    ];

    return {
      threads: mockThreads,
      posts: mockPosts,
      users: mockUsers
    };
  }

  setActiveTab(tab: 'threads' | 'posts' | 'users'): void {
    this.activeTab = tab;
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchResults = null;
    this.searchQuery = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getResultCount(): number {
    if (!this.searchResults) return 0;
    switch (this.activeTab) {
      case 'threads': return this.searchResults.threads.length;
      case 'posts': return this.searchResults.posts.length;
      case 'users': return this.searchResults.users?.length || 0;
      default: return 0;
    }
  }

  viewPost(post: ForumPost): void {
    // Navigate to post in thread
    console.log('View post:', post.id);
  }

  reportPost(post: ForumPost): void {
    // Navigate to report form
    console.log('Report post:', post.id);
  }

  viewUserProfile(user: any): void {
    // Navigate to user profile
    console.log('View user profile:', user.id);
  }

  sendMessage(user: any): void {
    // Navigate to messaging
    console.log('Send message to:', user.id);
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'MODERATOR': return 'Modérateur';
      case 'USER': return 'Utilisateur';
      default: return 'Utilisateur';
    }
  }
}
