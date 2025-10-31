import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, Role } from '../../../models/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserEditComponent implements OnInit {
  user: User | null = null;
  loading = false;
  saving = false;
  userId: number = 0;
  isNewUser = false;

  roles = [
    { value: Role.USER, label: 'Utilisateur' },
    { value: Role.MODERATOR, label: 'Modérateur' },
    { value: Role.RECRUITER, label: 'Recruteur' },
    { value: Role.CANDIDATE, label: 'Candidat' },
    { value: Role.AI_ANALYST, label: 'Analyste IA' },
    { value: Role.ADMIN, label: 'Administrateur' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUser();
      } else {
        // Check if we're editing current user profile (when accessed via /profile/edit)
        const url = this.route.snapshot.url.join('/');
        if (url.includes('edit')) {
          this.loadCurrentUserForEdit();
        } else {
          this.isNewUser = true;
          this.initializeNewUser();
        }
      }
    });
  }

  private loadCurrentUserForEdit(): void {
    // Load current logged-in user for editing
    this.loading = true;
    // For demo purposes, load mock current user
    this.user = {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+33123456789',
      dateOfBirth: new Date('1990-05-15'),
      createdAt: new Date('2023-01-15'),
      lastLogin: new Date('2024-01-20'),
      isMentor: true,
      mentorBio: 'Expert en développement web avec 10 ans d\'expérience',
      mentorExpertise: 'JavaScript, Angular, Node.js',
      banned: false,
      isModerator: false,
      expertise: 'Développement Full Stack',
      languages: 'Français, Anglais',
      availability: 'Disponible les weekends',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      mentorSince: new Date('2023-06-01'),
      profilePictureUrl: 'https://via.placeholder.com/150',
      role: Role.USER
    };
    this.loading = false;
  }

  loadUser(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = { ...user };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.loading = false;
        // Initialize with empty user for editing
        this.initializeNewUser();
      }
    });
  }

  private initializeNewUser(): void {
    this.user = {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      createdAt: new Date(),
      isMentor: false,
      banned: false,
      isModerator: false,
      role: Role.USER
    };
  }

  saveUser(): void {
    if (!this.user) return;

    // Basic validation
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.saving = true;

    if (this.isNewUser) {
      this.userService.createUser(this.user).subscribe({
        next: (createdUser) => {
          this.saving = false;
          alert('Utilisateur créé avec succès !');
          this.router.navigate(['/users', createdUser.id]);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.saving = false;
          alert('Erreur lors de la création de l\'utilisateur.');
        }
      });
    } else {
      this.userService.updateUser(this.userId, this.user).subscribe({
        next: (updatedUser) => {
          this.saving = false;
          alert('Utilisateur modifié avec succès !');
          this.router.navigate(['/users', updatedUser.id]);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.saving = false;
          alert('Erreur lors de la modification de l\'utilisateur.');
        }
      });
    }
  }

  cancel(): void {
    if (this.isNewUser) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate(['/users', this.userId]);
    }
  }

  toggleMentorStatus(): void {
    if (this.user) {
      this.user.isMentor = !this.user.isMentor;
      if (!this.user.isMentor) {
        // Clear mentor-specific fields
        this.user.mentorBio = '';
        this.user.mentorExpertise = '';
        this.user.availability = '';
        this.user.mentorSince = undefined;
      } else {
        this.user.mentorSince = new Date();
      }
    }
  }

  getRoleLabel(role: Role): string {
    return this.roles.find(r => r.value === role)?.label || role;
  }
}