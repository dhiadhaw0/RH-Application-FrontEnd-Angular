import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../../services/forum.service';
import { ForumThread } from '../../../models/forum-thread.model';
import { ForumPost } from '../../../models/forum-post.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-thread-detail',
  templateUrl: './forum-thread-detail.component.html',
  styleUrl: './forum-thread-detail.component.scss'
})
export class ForumThreadDetailComponent implements OnInit {
  threadId: number = 0;
  thread: ForumThread | null = null;
  posts: ForumPost[] = [];
  loading = true;
  error: string | null = null;
  currentUser: User | null = null; // This should come from auth service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.threadId = +params['threadId'];
      if (this.threadId) {
        this.loadThreadDetails();
      }
    });
  }

  loadThreadDetails(): void {
    this.loading = true;

    // Load thread details
    // Note: We might need to add a method to get thread by ID in the service
    // For now, we'll load posts and assume thread info comes from there
    this.forumService.listPosts(this.threadId, this.currentUser?.id || null).subscribe({
      next: (posts) => {
        this.posts = posts;
        if (posts.length > 0) {
          // Extract thread info from the first post (assuming all posts belong to same thread)
          // In a real implementation, you'd have a separate endpoint for thread details
          this.thread = posts[0].thread;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la discussion';
        this.loading = false;
        console.error('Error loading thread details:', err);
      }
    });
  }

  goBack(): void {
    if (this.thread) {
      this.router.navigate(['/forum', 'category', this.thread.category.id]);
    } else {
      this.router.navigate(['/forum']);
    }
  }

  createNewPost(): void {
    this.router.navigate(['/forum', 'post', 'create', this.threadId]);
  }

  onPostCreated(post: ForumPost): void {
    this.posts.push(post);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getThreadStatus(): string {
    if (!this.thread) return '';

    if (this.thread.isPinned && this.thread.isClosed) {
      return 'Épinglé et fermé';
    } else if (this.thread.isPinned) {
      return 'Épinglé';
    } else if (this.thread.isClosed) {
      return 'Fermé';
    }
    return '';
  }

  getThreadStatusClass(): string {
    if (!this.thread) return '';

    if (this.thread.isPinned && this.thread.isClosed) {
      return 'status-pinned-closed';
    } else if (this.thread.isPinned) {
      return 'status-pinned';
    } else if (this.thread.isClosed) {
      return 'status-closed';
    }
    return '';
  }

  canPost(): boolean {
    return this.thread ? !this.thread.isClosed : false;
  }

  canEditThread(): boolean {
    return this.thread ? this.thread.author.id === this.currentUser?.id : false;
  }

  editThread(): void {
    if (this.canEditThread() && this.thread) {
      // Navigate to thread edit page (would need to be implemented)
      console.log('Edit thread:', this.thread.id);
      // this.router.navigate(['/forum', 'thread', 'edit', this.thread.id]);
    }
  }

  reportThread(): void {
    if (this.thread) {
      this.router.navigate(['/forum', 'report', 'create'], {
        queryParams: { threadId: this.thread.id, type: 'thread' }
      });
    }
  }

  viewThreadHistory(): void {
    if (this.thread) {
      this.router.navigate(['/forum', 'thread', this.thread.id, 'versions']);
    }
  }
}
