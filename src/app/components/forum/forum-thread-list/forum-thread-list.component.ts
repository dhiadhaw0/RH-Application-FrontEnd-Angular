import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../../services/forum.service';
import { ForumThread } from '../../../models/forum-thread.model';
import { ForumCategory } from '../../../models/forum-category.model';
import { Role, User } from '../../../models/user.model';

@Component({
  selector: 'app-forum-thread-list',
  templateUrl: './forum-thread-list.component.html',
  styleUrl: './forum-thread-list.component.scss'
})
export class ForumThreadListComponent implements OnInit {
  categoryId: number = 0;
  category: ForumCategory | null = null;
  threads: ForumThread[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    // Load sample threads for all categories when used in navigation
    this.loadSampleThreads();
  }

  loadSampleThreads(): void {
    this.loading = true;
    // Simulate loading delay
    setTimeout(() => {
      this.threads = [
        {
          id: 1,
          title: 'Bienvenue dans la communauté de développement !',
          content: 'Présentez-vous et partagez votre expérience...',
          author: {
            id: 1,
            firstName: 'Admin',
            lastName: 'Forum',
            email: 'admin@forum.com',
            dateOfBirth: new Date('1990-01-01'),
            createdAt: new Date(),
            isMentor: false,
            banned: false,
            phoneNumber: '',
            profilePictureUrl: '',
            lastLogin: new Date(),
            isModerator: true,
            role: Role.MODERATOR
          },
          category: {
            id: 1,
            name: 'Développement',
            description: 'Discussions sur le développement web, mobile et logiciel',
            allowAnonymous: true
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          isPinned: true,
          isClosed: false,
          lastPost: {
            id: 1,
            content: 'Bienvenue à tous !',
            author: {
              id: 2,
              firstName: 'Marie',
              lastName: 'Dev',
              email: 'marie@dev.com',
              dateOfBirth: new Date('1992-07-10'),
              createdAt: new Date(),
              isMentor: false,
              banned: false,
              phoneNumber: '333444555',
              profilePictureUrl: 'https://via.placeholder.com/150',
              lastLogin: new Date(),
              isModerator: false,
              role: Role.USER
            } as User,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            anonymous: false
          }
        },
        {
          id: 2,
          title: 'Frameworks JavaScript : React vs Vue.js',
          content: 'Quel framework préférez-vous et pourquoi ?',
          author: {
            id: 3,
            firstName: 'Jean',
            lastName: 'Tech',
            email: 'jean@tech.com',
            dateOfBirth: new Date('1988-03-15'),
            createdAt: new Date(),
            isMentor: true,
            banned: false,
            phoneNumber: '111222333',
            profilePictureUrl: 'https://via.placeholder.com/150',
            lastLogin: new Date(),
            isModerator: false,
            role: Role.USER
          } as User,
          category: {
            id: 1,
            name: 'Développement',
            description: 'Discussions sur le développement web, mobile et logiciel',
            allowAnonymous: true
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          // updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          isPinned: false,
          isClosed: false,
          // postCount: 8,
          lastPost: {
            id: 2,
            content: 'Je préfère Vue.js pour sa simplicité',
            author: {
              id: 4,
              firstName: 'Pierre',
              lastName: 'Code',
              email: 'pierre@code.com',
              dateOfBirth: new Date('1988-03-20'),
              createdAt: new Date(),
              isMentor: true,
              banned: false,
              phoneNumber: '555666777',
              profilePictureUrl: 'https://via.placeholder.com/150',
              lastLogin: new Date(),
              isModerator: false,
              role: Role.USER
            },
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            anonymous: false
          }
        },
        {
          id: 3,
          title: 'Recherche développeur Angular expérimenté',
          content: 'Nous recrutons un développeur Angular senior...',
          author: {
            id: 5,
            firstName: 'RH',
            lastName: 'TechCorp',
            email: 'rh@techcorp.com',
            dateOfBirth: new Date('1980-05-10'),
            createdAt: new Date(),
            isMentor: false,
            banned: false,
            phoneNumber: '555666777',
            profilePictureUrl: 'https://via.placeholder.com/150',
            lastLogin: new Date(),
            isModerator: false,
            role: Role.RECRUITER
          } as User,
          category: {
            id: 3,
            name: 'Emploi',
            description: 'Conseils carrière, recherche d\'emploi et opportunités',
            allowAnonymous: true
          },
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          // updatedAt: new Date(Date.now() - 259200000).toISOString(),
          isPinned: false,
          isClosed: false,
          //postCount: 5,
          lastPost: {
            id: 3,
            content: 'Intéressant, pouvez-vous donner plus de détails ?',
            author: {
              id: 6,
              firstName: 'Alice',
              lastName: 'Dev',
              email: 'alice@dev.com',
              dateOfBirth: new Date('1995-12-05'),
              createdAt: new Date(),
              isMentor: false,
              banned: false,
              phoneNumber: '666777888',
              profilePictureUrl: 'https://via.placeholder.com/150',
              lastLogin: new Date(),
              isModerator: false,
              role: Role.USER
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            anonymous: false
          }
        }
      ];
      this.loading = false;
    }, 500);
  }

  navigateToThread(thread: ForumThread): void {
    this.router.navigate(['/forum', 'thread', thread.id]);
  }

  createNewThread(): void {
    this.router.navigate(['/forum', 'thread', 'create'], {
      queryParams: { categoryId: this.categoryId }
    });
  }

  goBack(): void {
    this.router.navigate(['/forum']);
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Aujourd\'hui';
    } else if (diffDays === 2) {
      return 'Hier';
    } else if (diffDays <= 7) {
      return `Il y a ${diffDays - 1} jours`;
    } else {
      return d.toLocaleDateString('fr-FR');
    }
  }

  getPinnedThreads(): ForumThread[] {
    return this.threads.filter(t => t.isPinned);
  }

  getRegularThreads(): ForumThread[] {
    return this.threads.filter(t => !t.isPinned);
  }

  getThreadStatus(thread: ForumThread): string {
    if (thread.isPinned && thread.isClosed) {
      return 'Épinglé et fermé';
    } else if (thread.isPinned) {
      return 'Épinglé';
    } else if (thread.isClosed) {
      return 'Fermé';
    }
    return '';
  }

  getThreadStatusClass(thread: ForumThread): string {
    if (thread.isPinned && thread.isClosed) {
      return 'status-pinned-closed';
    } else if (thread.isPinned) {
      return 'status-pinned';
    } else if (thread.isClosed) {
      return 'status-closed';
    }
    return '';
  }

  reportThread(thread: ForumThread): void {
    // Navigate to report form with thread context
    this.router.navigate(['/forum', 'report', 'create'], {
      queryParams: { threadId: thread.id, type: 'thread' }
    });
  }

  loadThreads(): void {
    this.loadSampleThreads();
  }

  getTotalReplies(): number {
    // Calculate total replies from all threads
    return this.threads.reduce((total, thread) => {
      // Assuming each thread has at least 1 post (the original), so replies = postCount - 1
      // For now, return a random number based on thread count
      return total + Math.floor(Math.random() * 20) + 5;
    }, 0);
  }

  getActiveUsers(): number {
    // Get unique active users from threads
    const uniqueUsers = new Set();
    this.threads.forEach(thread => {
      uniqueUsers.add(thread.author.id);
      if (thread.lastPost) {
        uniqueUsers.add(thread.lastPost.author.id);
      }
    });
    return uniqueUsers.size;
  }
}
