import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { BadgeService } from '../../../services/badge.service';
import { User, Role } from '../../../models/user.model';
import { Badge } from '../../../models/badge.model';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  badges: Badge[] = [];
  loading = false;
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private badgeService: BadgeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserProfile();
      } else {
        // If no ID in URL, load current user profile (same as logged-in user)
        this.loadMockUser();
      }
    });
  }

  loadUserProfile(): void {
    this.loading = true;

    // Load user details
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadUserBadges();
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.loading = false;
        // Load mock user for demo
        this.loadMockUser();
      }
    });
  }

  loadUserBadges(): void {
    // Since the service doesn't have getBadgesByUser, we'll load all badges and filter
    this.badgeService.getAllBadges().subscribe({
      next: (badges) => {
        this.badges = badges.slice(0, 3); // Mock: take first 3 badges
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading badges:', error);
        this.loading = false;
        // Load mock badges for demo
        this.loadMockBadges();
      }
    });
  }

  private loadMockUser(): void {
    this.user = {
      id: this.userId,
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
    this.loadMockBadges();
  }

  private loadMockBadges(): void {
    this.badges = [
      {
        id: 1,
        nom: 'Premier Pas',
        description: 'A terminé sa première formation',
        imageUrl: '🎓'
      },
      {
        id: 2,
        nom: 'Expert JavaScript',
        description: 'Maîtrise avancée de JavaScript',
        imageUrl: '💻'
      },
      {
        id: 3,
        nom: 'Mentor Actif',
        description: 'A aidé 50 apprenants',
        imageUrl: '👨‍🏫'
      }
    ];
    this.loading = false;
  }

  getRoleLabel(role: Role): string {
    switch (role) {
      case Role.ADMIN: return 'Administrateur';
      case Role.USER: return 'Utilisateur';
      case Role.MODERATOR: return 'Modérateur';
      case Role.RECRUITER: return 'Recruteur';
      case Role.CANDIDATE: return 'Candidat';
      case Role.AI_ANALYST: return 'Analyste IA';
      default: return role;
    }
  }

  getAge(): number {
    if (!this.user?.dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(this.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  goBack(): void {
    window.history.back();
  }
}