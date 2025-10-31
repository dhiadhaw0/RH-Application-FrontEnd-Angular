import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../../services/forum.service';
import { ForumPostVersion } from '../../../models/forum-post-version.model';
import { ForumPost } from '../../../models/forum-post.model';

@Component({
  selector: 'app-forum-post-version-history',
  templateUrl: './forum-post-version-history.component.html',
  styleUrl: './forum-post-version-history.component.scss'
})
export class ForumPostVersionHistoryComponent implements OnInit {
  postId: number = 0;
  versions: ForumPostVersion[] = [];
  currentPost: ForumPost | null = null;
  loading = true;
  error: string | null = null;
  selectedVersion: ForumPostVersion | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['postId'];
      if (this.postId) {
        this.loadVersionHistory();
      }
    });
  }

  loadVersionHistory(): void {
    this.loading = true;
    // This would typically call a service method to get post versions
    // For now, we'll simulate loading versions
    setTimeout(() => {
      this.versions = this.generateMockVersions();
      this.currentPost = this.versions[0]?.post || null;
      this.loading = false;
    }, 1000);
  }

  private generateMockVersions(): ForumPostVersion[] {
    // Mock data for demonstration - simplified to avoid type errors
    const mockVersions: ForumPostVersion[] = [
      {
        id: 1,
        post: {} as ForumPost, // Simplified for demo
        content: 'This is the current version of the post with some updates.',
        editedAt: new Date(),
        editor: {} as any, // Simplified for demo
        versionNumber: 3
      },
      {
        id: 2,
        post: {} as ForumPost, // Simplified for demo
        content: 'This is version 2 of the post.',
        editedAt: new Date(Date.now() - 3600000),
        editor: {} as any, // Simplified for demo
        versionNumber: 2
      },
      {
        id: 3,
        post: {} as ForumPost, // Simplified for demo
        content: 'This is the original version of the post.',
        editedAt: new Date(Date.now() - 7200000),
        editor: {} as any, // Simplified for demo
        versionNumber: 1
      }
    ];
    return mockVersions;
  }

  selectVersion(version: ForumPostVersion): void {
    this.selectedVersion = version;
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

  getEditorName(version: ForumPostVersion): string {
    return `${version.editor.firstName} ${version.editor.lastName}`;
  }

  isCurrentVersion(version: ForumPostVersion): boolean {
    return version.versionNumber === Math.max(...this.versions.map(v => v.versionNumber));
  }

  goBack(): void {
    this.router.navigate(['/forum/thread', this.currentPost?.thread.id]);
  }

  compareVersions(): void {
    // Implement version comparison logic
    console.log('Compare versions');
  }
}
