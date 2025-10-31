import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { User, Role } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { FormationService } from '../../services/formation.service';
import { JobOfferService } from '../../services/job-offer.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

interface SearchResult {
  id: number;
  title: string;
  type: string;
  icon: string;
  route: string;
}

interface BreadcrumbItem {
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})

export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showDropdown = false;
  mobileMenuOpen = false;
  unreadNotifications = 0;
  showMentorshipDropdown = false;
  showCertificationsDropdown = false;
  showMobileMentorship = false;
  showMobileCertifications = false;
  showLearningDropdown = false;
  showCareerDropdown = false;
  showUserDropdown = false;
  chatbotOpen = false;
  searchQuery = '';
  searchActive = false;
  searchResults: SearchResult[] = [];
  selectedResultIndex = -1;
  breadcrumbs: BreadcrumbItem[] = [];
  navbarOpacity: number = 1;
  private subscriptions: Subscription[] = [];
  private searchTimeout: any;

  constructor(
    private userService: UserService,
    private formationService: FormationService,
    private jobOfferService: JobOfferService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUnreadNotifications();
    this.setupBreadcrumbNavigation();
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private loadCurrentUser(): void {
    // TODO: Implement proper authentication service
    // For now, we'll simulate a logged-in user
    this.currentUser = {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
      isMentor: true,
      banned: false,
      isModerator: false,
      dateOfBirth: new Date('1990-01-01'),
      createdAt: new Date(),
      lastLogin: new Date()
    };
  }

  private loadUnreadNotifications(): void {
    if (this.currentUser) {
      const sub = this.userService.getNotifications(this.currentUser.id).subscribe({
        next: (notifications) => {
          this.unreadNotifications = notifications.filter(n => !n.isRead).length;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
      this.subscriptions.push(sub);
    }
  }

  toggleUserDropdown(): void {
    // Close all other dropdowns first
    this.showMentorshipDropdown = false;
    this.showCertificationsDropdown = false;
    this.showLearningDropdown = false;
    this.showCareerDropdown = false;

    // Toggle this specific dropdown
    this.showUserDropdown = !this.showUserDropdown;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleMentorshipDropdown(): void {
    this.showMentorshipDropdown = !this.showMentorshipDropdown;
    this.showCertificationsDropdown = false;
  }

  toggleCertificationsDropdown(): void {
    this.showCertificationsDropdown = !this.showCertificationsDropdown;
    this.showMentorshipDropdown = false;
  }

  closeDropdowns(): void {
    this.showMentorshipDropdown = false;
    this.showCertificationsDropdown = false;
    this.showLearningDropdown = false;
    this.showCareerDropdown = false;
    this.showUserDropdown = false;
  }

  toggleLearningDropdown(): void {
    this.showLearningDropdown = !this.showLearningDropdown;
    this.showCareerDropdown = false;
    this.showMentorshipDropdown = false;
    this.showCertificationsDropdown = false;
  }

  toggleCareerDropdown(): void {
    this.showCareerDropdown = !this.showCareerDropdown;
    this.showLearningDropdown = false;
    this.showMentorshipDropdown = false;
    this.showCertificationsDropdown = false;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.showMobileMentorship = false;
    this.showMobileCertifications = false;
  }

  toggleSearch(): void {
    this.searchActive = !this.searchActive;
    if (this.searchActive) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  closeSearch(): void {
    this.searchActive = false;
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedResultIndex = -1;
  }

  toggleChatbot(): void {
    this.chatbotOpen = !this.chatbotOpen;
    // TODO: Implement chatbot toggle logic (e.g., emit event to parent component)
    console.log('Chatbot toggled:', this.chatbotOpen);
  }

  toggleMobileMentorship(): void {
    this.showMobileMentorship = !this.showMobileMentorship;
    this.showMobileCertifications = false;
  }

  toggleMobileCertifications(): void {
    this.showMobileCertifications = !this.showMobileCertifications;
    this.showMobileMentorship = false;
  }

  logout(): void {
    // TODO: Implement proper logout logic
    this.currentUser = null;
    this.showDropdown = false;
    this.unreadNotifications = 0;
    console.log('User logged out');
  }

  markNotificationsAsRead(): void {
    if (this.unreadNotifications > 0) {
      // TODO: Implement actual API call to mark notifications as read
      this.unreadNotifications = 0;
      console.log('Notifications marked as read');
    }
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this.searchQuery = query;
    this.selectedResultIndex = -1; // Reset selection on new input

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (query.trim().length > 2) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    } else {
      this.searchResults = [];
    }
  }

  onSearchBlur(): void {
    // Delay hiding to allow click on results
    setTimeout(() => {
      this.searchActive = false;
      this.searchResults = [];
    }, 200);
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) return;

    // Mock search results - in real app, this would call actual services
    this.searchResults = [
      {
        id: 1,
        title: 'Développeur Full Stack',
        type: 'Offre d\'emploi',
        icon: 'fas fa-briefcase',
        route: '/job-offers/1'
      },
      {
        id: 2,
        title: 'Formation React Avancé',
        type: 'Formation',
        icon: 'fas fa-book',
        route: '/formations/2'
      },
      {
        id: 3,
        title: 'John Mentor',
        type: 'Utilisateur',
        icon: 'fas fa-user',
        route: '/users/3'
      }
    ].filter(result =>
      result.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      result.type.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  navigateToResult(result: SearchResult): void {
    this.router.navigate([result.route]);
    this.searchActive = false;
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedResultIndex = -1;
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (!this.searchResults.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedResultIndex = Math.min(this.selectedResultIndex + 1, this.searchResults.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedResultIndex = Math.max(this.selectedResultIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedResultIndex >= 0 && this.selectedResultIndex < this.searchResults.length) {
          this.navigateToResult(this.searchResults[this.selectedResultIndex]);
        } else {
          this.performSearch();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.searchActive = false;
        this.searchResults = [];
        this.selectedResultIndex = -1;
        break;
    }
  }

  private setupBreadcrumbNavigation(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initial breadcrumb setup
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);

    this.breadcrumbs = [];

    if (segments.length > 0) {
      let currentPath = '';

      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        // Map route segments to readable labels
        const label = this.getBreadcrumbLabel(segment, currentPath);

        if (label) {
          this.breadcrumbs.push({
            label,
            route: currentPath,
            active: index === segments.length - 1
          });
        }
      });
    }
  }

  private setupScrollListener(): void {
    const scrollThreshold = 100; // pixels to scroll before starting fade

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > scrollThreshold) {
        // Calculate opacity: 1 at top, 0.3 at scrollThreshold + 200px
        const fadeRange = 200;
        const opacity = Math.max(0.3, 1 - (scrollTop - scrollThreshold) / fadeRange);
        this.navbarOpacity = opacity;
      } else {
        this.navbarOpacity = 1;
      }
    };

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup on destroy
    this.subscriptions.push({
      unsubscribe: () => window.removeEventListener('scroll', handleScroll)
    } as Subscription);
  }

  private getBreadcrumbLabel(segment: string, fullPath: string): string {
    // Route to label mapping - can be expanded based on your routing structure
    const routeLabels: { [key: string]: string } = {
      'formations': 'Formations',
      'job-offers': 'Offres d\'emploi',
      'applications': 'Candidatures',
      'forum': 'Forum',
      'users': 'Utilisateurs',
      'profile': 'Profil',
      'settings': 'Paramètres',
      'notifications': 'Notifications',
      'documents': 'Documents',
      'certifications': 'Certifications',
      'mentors': 'Mentors',
      'mentorship': 'Mentorat'
    };

    // Check for exact matches first
    if (routeLabels[segment]) {
      return routeLabels[segment];
    }

    // Handle dynamic routes (IDs)
    if (/^\d+$/.test(segment)) {
      // This is likely an ID, try to get a more meaningful label from the path
      const parentSegment = fullPath.split('/').filter(s => s && s !== segment).pop();
      if (parentSegment && routeLabels[parentSegment]) {
        return `${routeLabels[parentSegment]} - Détails`;
      }
    }

    // Handle create/edit actions
    if (segment === 'create') {
      const parentSegment = fullPath.split('/').filter(s => s && s !== segment).pop();
      if (parentSegment && routeLabels[parentSegment]) {
        return `Créer ${routeLabels[parentSegment].toLowerCase()}`;
      }
    }

    if (segment === 'edit') {
      const parentSegment = fullPath.split('/').filter(s => s && s !== segment).pop();
      if (parentSegment && routeLabels[parentSegment]) {
        return `Modifier ${routeLabels[parentSegment].toLowerCase()}`;
      }
    }

    // Return capitalized segment as fallback
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }


  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Close dropdown if clicked outside
    if (!target.closest('.user-menu')) {
      this.showDropdown = false;
    }

    // Close user dropdown if clicked outside
    if (!target.closest('.dropdown') || !target.closest('li.nav-item.dropdown')) {
      this.showUserDropdown = false;
    }

    // Close mentorship dropdown if clicked outside
    if (!target.closest('.dropdown')) {
      this.showMentorshipDropdown = false;
      this.showCertificationsDropdown = false;
    }

    // Close mobile menu if clicked outside on mobile
    if (window.innerWidth < 768 && !target.closest('.navbar')) {
      this.mobileMenuOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Close mobile menu on desktop
    if (event.target.innerWidth >= 768) {
      this.mobileMenuOpen = false;
    }
  }
}