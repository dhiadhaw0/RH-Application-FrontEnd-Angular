import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ForumUpvoteService } from '../../../services/forum-upvote.service';

@Component({
  selector: 'app-forum-upvote',
  templateUrl: './forum-upvote.component.html',
  styleUrl: './forum-upvote.component.scss'
})
export class ForumUpvoteComponent implements OnInit, OnChanges {
  @Input() postId!: number;
  @Input() userId!: number;

  upvotesCount = 0;
  hasUpvoted = false;
  loading = false;

  constructor(private upvoteService: ForumUpvoteService) {}

  ngOnInit(): void {
    this.loadUpvoteData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] || changes['userId']) {
      this.loadUpvoteData();
    }
  }

  loadUpvoteData(): void {
    if (!this.postId) return;

    // Load upvotes count
    this.upvoteService.countUpvotes(this.postId).subscribe({
      next: (count) => {
        this.upvotesCount = count;
      },
      error: (err) => {
        console.error('Error loading upvotes count:', err);
      }
    });

    // Check if user has upvoted (only if userId is provided)
    if (this.userId) {
      this.upvoteService.hasUserUpvoted(this.postId, this.userId).subscribe({
        next: (hasUpvoted) => {
          this.hasUpvoted = hasUpvoted;
        },
        error: (err) => {
          console.error('Error checking upvote status:', err);
        }
      });
    }
  }

  toggleUpvote(): void {
    if (!this.userId || this.loading) return;

    this.loading = true;
    this.upvoteService.upvotePost(this.postId, this.userId).subscribe({
      next: (success) => {
        if (success) {
          this.hasUpvoted = !this.hasUpvoted;
          this.upvotesCount += this.hasUpvoted ? 1 : -1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error toggling upvote:', err);
        this.loading = false;
      }
    });
  }

  getUpvoteButtonClass(): string {
    return this.hasUpvoted ? 'upvoted' : 'not-upvoted';
  }
}
