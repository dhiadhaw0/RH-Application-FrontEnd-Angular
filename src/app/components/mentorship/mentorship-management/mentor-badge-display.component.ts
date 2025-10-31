import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorshipService } from '../../../services/mentorship.service';

@Component({
  selector: 'app-mentor-badge-display',
  templateUrl: './mentor-badge-display.component.html',
  styleUrls: ['./mentor-badge-display.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MentorBadgeDisplayComponent implements OnInit {
  @Input() mentorId: number = 0;
  badge: string = '';
  loading = false;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    if (this.mentorId) {
      this.loadMentorBadge();
    }
  }

  ngOnChanges(): void {
    if (this.mentorId) {
      this.loadMentorBadge();
    }
  }

  loadMentorBadge(): void {
    this.loading = true;
    this.mentorshipService.getMentorBadge(this.mentorId).subscribe({
      next: (badge) => {
        this.badge = badge;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading mentor badge:', error);
        this.badge = 'Mentor'; // Default badge
        this.loading = false;
      }
    });
  }

  getBadgeColor(): string {
    switch (this.badge.toLowerCase()) {
      case 'expert': return '#28a745';
      case 'senior': return '#007bff';
      case 'mentor': return '#6f42c1';
      case 'junior': return '#ffc107';
      default: return '#6c757d';
    }
  }

  getBadgeIcon(): string {
    switch (this.badge.toLowerCase()) {
      case 'expert': return '👑';
      case 'senior': return '⭐';
      case 'mentor': return '🎓';
      case 'junior': return '🌱';
      default: return '🏆';
    }
  }
}