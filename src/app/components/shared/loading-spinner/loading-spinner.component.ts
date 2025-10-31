import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  @Input() show: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: string = '#667eea';

  isLoading: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    if (!this.show) {
      this.subscription = this.loadingService.isLoading().subscribe(
        loading => this.isLoading = loading
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  shouldShow(): boolean {
    return this.show || this.isLoading;
  }
}
