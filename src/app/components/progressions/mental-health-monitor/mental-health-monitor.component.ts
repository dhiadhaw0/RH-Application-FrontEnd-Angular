import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WearableHealthService, WearableHealthData, MentalHealthRisk } from '../../../services/wearable-health.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-mental-health-monitor',
  templateUrl: './mental-health-monitor.component.html',
  styleUrls: ['./mental-health-monitor.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MentalHealthMonitorComponent implements OnInit, OnDestroy {
  @Input() userId: number = 1;
  @Input() progression: number = 0;

  healthData: WearableHealthData | null = null;
  healthRisk: MentalHealthRisk | null = null;
  loading = true;
  private subscription: Subscription = new Subscription();

  // Cute emoji representations
  getStressEmoji(): string {
    if (!this.healthData) return '🤔';
    if (this.healthData.stressLevel < 30) return '😌';
    if (this.healthData.stressLevel < 60) return '😐';
    if (this.healthData.stressLevel < 80) return '😰';
    return '😱';
  }

  getSleepEmoji(): string {
    if (!this.healthData) return '😴';
    if (this.healthData.sleepQuality > 80) return '😴💤';
    if (this.healthData.sleepQuality > 60) return '😴';
    if (this.healthData.sleepQuality > 40) return '😪';
    return '😵';
  }

  getWellnessEmoji(): string {
    if (!this.healthData) return '🤗';
    if (this.healthData.mentalWellnessScore > 80) return '🤗';
    if (this.healthData.mentalWellnessScore > 60) return '🙂';
    if (this.healthData.mentalWellnessScore > 40) return '😐';
    return '😞';
  }

  getRiskEmoji(): string {
    if (!this.healthRisk) return '🤔';
    switch (this.healthRisk.level) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '🤔';
    }
  }

  constructor(private healthService: WearableHealthService) {}

  ngOnInit(): void {
    this.loadHealthData();
    // Update health data every 30 seconds
    this.subscription.add(
      interval(30000).subscribe(() => {
        this.loadHealthData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadHealthData(): void {
    this.loading = true;
    this.subscription.add(
      this.healthService.getCurrentHealthData(this.userId).subscribe({
        next: (data) => {
          this.healthData = data;
          this.healthRisk = this.healthService.assessMentalHealthRisk(data, this.progression);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading health data:', error);
          this.loading = false;
        }
      })
    );
  }

  getRiskColor(): string {
    if (!this.healthRisk) return '#95a5a6';
    switch (this.healthRisk.level) {
      case 'low': return '#27ae60';
      case 'medium': return '#f39c12';
      case 'high': return '#e67e22';
      case 'critical': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getRiskLabel(): string {
    if (!this.healthRisk) return 'Chargement...';
    switch (this.healthRisk.level) {
      case 'low': return 'Faible';
      case 'medium': return 'Modéré';
      case 'high': return 'Élevé';
      case 'critical': return 'Critique';
      default: return 'Inconnu';
    }
  }
}