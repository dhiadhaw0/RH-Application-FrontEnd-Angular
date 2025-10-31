import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';
  activeFilter: 'all' | 'mentors' | 'moderators' | 'active' = 'all';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterUsers();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.filterUsers();
  }

  getUserAge(user: User): number {
    if (!user.dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getSkillsArray(skills: string): string[] {
    return skills ? skills.split(',').map(skill => skill.trim()) : [];
  }

  getLanguagesArray(languages: string): string[] {
    return languages ? languages.split(',').map(lang => lang.trim()) : [];
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.expertise?.toLowerCase().includes(term) ||
        user.languages?.toLowerCase().includes(term)
      );
    }
    this.applyActiveFilter();
  }

  setFilter(filter: 'all' | 'mentors' | 'moderators' | 'active'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filterUsers();
  }

  private applyActiveFilter(): void {
    switch (this.activeFilter) {
      case 'mentors':
        this.filteredUsers = this.filteredUsers.filter(user => user.isMentor);
        break;
      case 'moderators':
        this.filteredUsers = this.filteredUsers.filter(user => user.isModerator);
        break;
      case 'active':
        this.filteredUsers = this.filteredUsers.filter(user => !user.banned);
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }
  }

  getMentorsCount(): number {
    return this.users.filter(user => user.isMentor).length;
  }

  getModeratorsCount(): number {
    return this.users.filter(user => user.isModerator).length;
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.banned;
    const action = newStatus ? 'bannir' : 'débannir';

    if (confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      // For now, just update locally since the service method might not exist
      user.banned = newStatus;
      // TODO: Call service method when available
      // this.userService.toggleUserStatus(user.id, newStatus).subscribe(...)
      console.log(`User ${user.id} status toggled to:`, newStatus ? 'banned' : 'active');
    }
  }

  viewUserDetails(user: User): void {
    // TODO: Navigate to user detail page
    console.log('View user details:', user.id);
  }

  editUser(user: User): void {
    // Navigate to edit user page
    // Note: Need to import Router first
    console.log('Edit user:', user.id);
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  promoteToModerator(user: User): void {
    // TODO: Implement promote to moderator
    console.log('Promote user to moderator:', user.id);
  }

  demoteFromModerator(user: User): void {
    // TODO: Implement demote from moderator
    console.log('Demote user from moderator:', user.id);
  }

  viewUserMentorships(user: User): void {
    // TODO: Navigate to user's mentorship sessions
    console.log('View mentorships for user:', user.id);
  }

  viewUserApplications(user: User): void {
    // TODO: Navigate to user's applications
    console.log('View applications for user:', user.id);
  }

  viewUserFormations(user: User): void {
    // TODO: Navigate to user's formations
    console.log('View formations for user:', user.id);
  }
}