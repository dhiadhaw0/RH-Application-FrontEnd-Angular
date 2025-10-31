import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WearableHealthData {
  userId: number;
  timestamp: Date;
  heartRate: number;
  stressLevel: number; // 0-100
  sleepQuality: number; // 0-100
  activityLevel: number; // 0-100
  mentalWellnessScore: number; // 0-100
}

export interface MentalHealthRisk {
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WearableHealthService {

  constructor() { }

  // Simulate getting real-time health data from wearables
  getCurrentHealthData(userId: number): Observable<WearableHealthData> {
    // Mock data - in real app, this would connect to wearable APIs
    const mockData: WearableHealthData = {
      userId: userId,
      timestamp: new Date(),
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
      stressLevel: Math.floor(Math.random() * 100),
      sleepQuality: Math.floor(Math.random() * 100),
      activityLevel: Math.floor(Math.random() * 100),
      mentalWellnessScore: Math.floor(Math.random() * 100)
    };

    return of(mockData);
  }

  // Get health data over time for analysis
  getHealthHistory(userId: number, days: number = 7): Observable<WearableHealthData[]> {
    const history: WearableHealthData[] = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      history.push({
        userId: userId,
        timestamp: date,
        heartRate: Math.floor(Math.random() * 40) + 60,
        stressLevel: Math.floor(Math.random() * 100),
        sleepQuality: Math.floor(Math.random() * 100),
        activityLevel: Math.floor(Math.random() * 100),
        mentalWellnessScore: Math.floor(Math.random() * 100)
      });
    }

    return of(history);
  }

  // Assess mental health risk based on health data and progression
  assessMentalHealthRisk(healthData: WearableHealthData, progression: number): MentalHealthRisk {
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let message = '';
    const recommendations: string[] = [];

    // Calculate risk based on multiple factors
    const stressRisk = healthData.stressLevel > 70 ? 3 : healthData.stressLevel > 50 ? 2 : 1;
    const sleepRisk = healthData.sleepQuality < 50 ? 3 : healthData.sleepQuality < 70 ? 2 : 1;
    const wellnessRisk = healthData.mentalWellnessScore < 50 ? 3 : healthData.mentalWellnessScore < 70 ? 2 : 1;
    const progressionRisk = progression < 30 ? 3 : progression < 60 ? 2 : 1;

    const totalRisk = stressRisk + sleepRisk + wellnessRisk + progressionRisk;

    if (totalRisk >= 10) {
      riskLevel = 'critical';
      message = 'Risque critique de santé mentale détecté. Intervention immédiate recommandée.';
      recommendations.push('Contacter un professionnel de santé', 'Réduire la charge de travail', 'Prendre une pause prolongée');
    } else if (totalRisk >= 7) {
      riskLevel = 'high';
      message = 'Risque élevé de fatigue mentale. Surveillance étroite nécessaire.';
      recommendations.push('Augmenter les pauses', 'Améliorer la qualité du sommeil', 'Consulter un mentor');
    } else if (totalRisk >= 5) {
      riskLevel = 'medium';
      message = 'Risque modéré de stress. Prévention recommandée.';
      recommendations.push('Pratiquer des exercices de relaxation', 'Maintenir un équilibre vie-travail');
    } else {
      riskLevel = 'low';
      message = 'Santé mentale dans de bonnes conditions.';
      recommendations.push('Continuer les bonnes pratiques');
    }

    return { level: riskLevel, message, recommendations };
  }

  // Calculate bonus adjustment based on health and progression
  calculateBonusAdjustment(progression: number, healthRisk: MentalHealthRisk): number {
    let baseBonus = progression * 0.1; // 10% of progression as base bonus

    switch (healthRisk.level) {
      case 'low':
        return baseBonus * 1.2; // 20% bonus for good health
      case 'medium':
        return baseBonus * 1.0; // Standard bonus
      case 'high':
        return baseBonus * 0.8; // 20% reduction for high risk
      case 'critical':
        return baseBonus * 0.5; // 50% reduction for critical risk
      default:
        return baseBonus;
    }
  }
}