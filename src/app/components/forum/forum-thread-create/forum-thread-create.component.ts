import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumCategory } from '../../../models/forum-category.model';
import { User, Role } from '../../../models/user.model';

@Component({
  selector: 'app-forum-thread-create',
  templateUrl: './forum-thread-create.component.html',
  styleUrl: './forum-thread-create.component.scss'
})
export class ForumThreadCreateComponent implements OnInit {
  threadForm: FormGroup;
  categories: ForumCategory[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  successMessage: string | null = null;
  currentUser: User | null = null; // This should come from auth service
  showPreview = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private forumService: ForumService
  ) {
    this.threadForm = this.fb.group({
      categoryId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      anonymous: [false],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setCurrentUser();
    this.checkCategoryFromUrl();
  }

  private setCurrentUser(): void {
    // Mock current user for demo purposes
    this.currentUser = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      dateOfBirth: new Date('1990-01-01'),
      createdAt: new Date(),
      isMentor: false,
      banned: false,
      phoneNumber: '',
      profilePictureUrl: '',
      lastLogin: new Date(),
      isModerator: false,
      role: Role.USER
    };
  }

  private checkCategoryFromUrl(): void {
    // Check if categoryId is passed in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    if (categoryId) {
      this.threadForm.patchValue({ categoryId: categoryId });
    }
  }

  loadCategories(): void {
    this.loading = true;

    // Try API first, fallback to static data
    this.forumService.listCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        console.log('API not available, loading static categories');
        // Fallback to static categories
        this.categories = [
          {
            id: 1,
            name: 'Développement',
            description: 'Discussions sur le développement web, mobile et logiciel',
            allowAnonymous: true
          },
          {
            id: 2,
            name: 'Design',
            description: 'Questions et échanges sur l\'UX/UI et le design graphique',
            allowAnonymous: false
          },
          {
            id: 3,
            name: 'Emploi',
            description: 'Conseils carrière, recherche d\'emploi et opportunités',
            allowAnonymous: true
          },
          {
            id: 4,
            name: 'Data Science',
            description: 'Machine learning, analyse de données et intelligence artificielle',
            allowAnonymous: false
          }
        ];
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.threadForm.valid && this.currentUser) {
      this.submitting = true;
      this.error = null;
      this.successMessage = null;

      const formValue = this.threadForm.value;

      // Simulate API call for demo purposes
      setTimeout(() => {
        // Mock successful thread creation
        const mockThread = {
          id: Date.now(), // Generate a mock ID
          title: formValue.title,
          content: formValue.content,
          categoryId: formValue.categoryId,
          authorId: this.currentUser!.id,
          createdAt: new Date().toISOString(),
          isPinned: false,
          isClosed: false
        };

        this.submitting = false;
        this.successMessage = 'Discussion créée avec succès ! Redirection en cours...';

        // Navigate to the newly created thread after a short delay
        setTimeout(() => {
          this.router.navigate(['/forum', 'thread', mockThread.id]);
        }, 1500);
      }, 2000); // Simulate 2 second API call

      
      // Real API call (commented out for demo)
      this.forumService.createThread(
        formValue.categoryId,
        this.currentUser.id,
        formValue.title,
        formValue.content
      ).subscribe({
        next: (thread) => {
          this.submitting = false;
          this.successMessage = 'Discussion créée avec succès !';
          // Navigate to the newly created thread
          setTimeout(() => {
            this.router.navigate(['/forum', 'thread', thread.id]);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Erreur lors de la création de la discussion';
          this.submitting = false;
          console.error('Error creating thread:', err);
        }
      });
      
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.threadForm.controls).forEach(key => {
      const control = this.threadForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.threadForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['maxlength']) {
        return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.threadForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  goBack(): void {
    this.router.navigate(['/forum']);
  }

  navigateToSearch(): void {
    this.router.navigate(['/forum', 'search']);
  }

  navigateToModeration(): void {
    this.router.navigate(['/forum', 'moderation', 'dashboard']);
  }
}
