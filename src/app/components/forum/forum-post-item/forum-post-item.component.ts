import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumPost } from '../../../models/forum-post.model';
import { User } from '../../../models/user.model';
import { ForumService } from '../../../services/forum.service';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-forum-post-item',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './forum-post-item.component.html',
  styleUrl: './forum-post-item.component.scss'
})
export class ForumPostItemComponent implements OnInit {
  @Input() post!: ForumPost;
  @Input() currentUser: User | null = null;
  @Input() showUpvote = true;
  @Input() isCompact = false;

  @Output() postEdited = new EventEmitter<ForumPost>();
  @Output() postDeleted = new EventEmitter<number>();
  @Output() postReported = new EventEmitter<ForumPost>();

  isEditing = false;
  showActions = false;

  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    if (!this.post) {
      console.error('ForumPostItemComponent: post input is required');
    }
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

  getAuthorDisplayName(): string {
    if (this.post.anonymous) {
      return 'Anonyme';
    }
    return `${this.post.author.firstName} ${this.post.author.lastName}`;
  }

  getAuthorAvatar(): string {
    if (this.post.anonymous) {
      return 'assets/images/anonymous-avatar.png'; // Default anonymous avatar
    }
    // Return user avatar or default
    return this.post.author.profilePictureUrl || 'assets/images/default-avatar.png';
  }

  isCurrentUserPost(): boolean {
    return this.currentUser ? this.currentUser.id === this.post.author.id : false;
  }

  canEditPost(): boolean {
    // Allow editing if user is the author and post is not too old (e.g., within 24 hours)
    if (!this.isCurrentUserPost()) return false;

    const postDate = new Date(this.post.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 24; // Allow editing within 24 hours
  }

  canDeletePost(): boolean {
    // Allow deletion if user is the author or a moderator
    return this.isCurrentUserPost() || this.isModerator();
  }

  private isModerator(): boolean {
    // This should check if current user has moderator privileges
    // For now, return false - implement based on your user roles system
    return false;
  }

  onEditPost(): void {
    this.isEditing = true;
  }

  onCancelEdit(): void {
    this.isEditing = false;
  }

  onSaveEdit(updatedPost: ForumPost): void {
    this.postEdited.emit(updatedPost);
    this.isEditing = false;
  }

  onDeletePost(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postDeleted.emit(this.post.id);
    }
  }

  onReportPost(): void {
    this.postReported.emit(this.post);
  }

  toggleActions(): void {
    this.showActions = !this.showActions;
  }

  onUpvote(): void {
    // Handle upvote logic
    console.log('Upvote post:', this.post.id);
  }

  onDownvote(): void {
    // Handle downvote logic
    console.log('Downvote post:', this.post.id);
  }
}
