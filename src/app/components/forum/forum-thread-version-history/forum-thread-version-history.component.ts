import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../../services/forum.service';
import { ForumThread } from '../../../models/forum-thread.model';
import { User } from '../../../models/user.model';

interface ThreadVersion {
  id: number;
  versionNumber: number;
  title: string;
  content: string;
  editedBy: User;
  editedAt: Date;
  changeType: 'title' | 'content' | 'both';
  isCurrent: boolean;
}

@Component({
  selector: 'app-forum-thread-version-history',
  templateUrl: './forum-thread-version-history.component.html',
  styleUrl: './forum-thread-version-history.component.scss'
})
export class ForumThreadVersionHistoryComponent implements OnInit {
  threadId: number = 0;
  currentThread: ForumThread | null = null;
  versions: ThreadVersion[] = [];
  loading = true;
  error: string | null = null;
  selectedVersion: ThreadVersion | null = null;
  showVersionModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.threadId = +params['threadId'];
      if (this.threadId) {
        this.loadThreadAndVersions();
      }
    });
  }

  loadThreadAndVersions(): void {
    this.loading = true;
    // Simulate loading current thread
    setTimeout(() => {
      this.currentThread = this.generateMockThread();
      this.versions = this.generateMockVersions();
      this.loading = false;
    }, 1000);
  }

  private generateMockThread(): ForumThread {
    return {
      id: this.threadId,
      title: 'Discussion actuelle sur Angular',
      content: 'Contenu actuel de la discussion après modifications.',
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
        name: 'Technologie',
        allowAnonymous: false
      },
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      isPinned: false,
      isClosed: false
    };
  }

  private generateMockVersions(): ThreadVersion[] {
    const baseDate = new Date(Date.now() - 86400000);
    const versions: ThreadVersion[] = [];

    // Current version
    versions.push({
      id: 5,
      versionNumber: 5,
      title: 'Discussion actuelle sur Angular',
      content: 'Contenu actuel de la discussion après modifications.',
      editedBy: {
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
      editedAt: new Date(baseDate.getTime() + 3600000), // +1 hour
      changeType: 'content',
      isCurrent: true
    });

    // Version 4
    versions.push({
      id: 4,
      versionNumber: 4,
      title: 'Discussion actuelle sur Angular',
      content: 'Contenu modifié de la discussion.',
      editedBy: {
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
      editedAt: new Date(baseDate.getTime() + 1800000), // +30 min
      changeType: 'content',
      isCurrent: false
    });

    // Version 3
    versions.push({
      id: 3,
      versionNumber: 3,
      title: 'Discussion sur Angular',
      content: 'Contenu modifié de la discussion.',
      editedBy: {
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
      editedAt: new Date(baseDate.getTime() + 900000), // +15 min
      changeType: 'title',
      isCurrent: false
    });

    // Version 2
    versions.push({
      id: 2,
      versionNumber: 2,
      title: 'Discussion sur Angular',
      content: 'Contenu initial modifié.',
      editedBy: {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@example.com',
        dateOfBirth: new Date('1988-03-20'),
        createdAt: new Date(),
        isMentor: false,
        banned: false,
        isModerator: false,
        role: 'USER' as any
      },
      editedAt: new Date(baseDate.getTime() + 300000), // +5 min
      changeType: 'content',
      isCurrent: false
    });

    // Version 1 (original)
    versions.push({
      id: 1,
      versionNumber: 1,
      title: 'Discussion sur Angular',
      content: 'Contenu initial de la discussion.',
      editedBy: {
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
      editedAt: baseDate,
      changeType: 'both',
      isCurrent: false
    });

    return versions;
  }

  viewVersion(version: ThreadVersion): void {
    this.selectedVersion = version;
    this.showVersionModal = true;
  }

  closeVersionModal(): void {
    this.showVersionModal = false;
    this.selectedVersion = null;
  }

  compareVersions(version1: ThreadVersion, version2: ThreadVersion): void {
    // Future implementation for version comparison
    console.log('Comparing versions:', version1.versionNumber, 'vs', version2.versionNumber);
  }

  goBack(): void {
    this.router.navigate(['/forum', 'thread', this.threadId]);
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

  getChangeTypeLabel(changeType: string): string {
    switch (changeType) {
      case 'title': return 'Titre modifié';
      case 'content': return 'Contenu modifié';
      case 'both': return 'Titre et contenu modifiés';
      default: return 'Modifié';
    }
  }

  getChangeTypeIcon(changeType: string): string {
    switch (changeType) {
      case 'title': return 'fas fa-heading';
      case 'content': return 'fas fa-edit';
      case 'both': return 'fas fa-exchange-alt';
      default: return 'fas fa-edit';
    }
  }
}
