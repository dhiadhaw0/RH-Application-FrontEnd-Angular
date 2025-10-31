import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillCreditService } from '../../../services/skill-credit.service';
import { SkillCredit, SkillCreditSource, SkillCreditStatus } from '../../../models/skill-credit.model';

@Component({
  selector: 'app-skill-credit-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-credit-showcase.component.html',
  styleUrls: ['./skill-credit-showcase.component.scss']
})
export class SkillCreditShowcaseComponent implements OnInit {
  creditStats = {
    totalEarned: 0,
    availableCredits: 0,
    conversionRate: 0.1,
    sampleCredits: [] as SkillCredit[]
  };

  conversionAmount: number = 1000;

  creditSources = [
    {
      source: SkillCreditSource.CERTIFICATION,
      icon: 'fas fa-certificate',
      title: 'Certifications',
      description: 'Gagnez des crédits en obtenant des certifications',
      creditAmount: 500,
      color: '#28a745'
    },
    {
      source: SkillCreditSource.TRAINING,
      icon: 'fas fa-graduation-cap',
      title: 'Formations',
      description: 'Accumulez des crédits en complétant des formations',
      creditAmount: 200,
      color: '#007bff'
    },
    {
      source: SkillCreditSource.ASSESSMENT,
      icon: 'fas fa-clipboard-check',
      title: 'Évaluations',
      description: 'Récompenses pour vos évaluations de compétences',
      creditAmount: 100,
      color: '#ffc107'
    },
    {
      source: SkillCreditSource.MENTORSHIP,
      icon: 'fas fa-users',
      title: 'Mentorat',
      description: 'Crédits bonus pour vos sessions de mentorat',
      creditAmount: 150,
      color: '#6f42c1'
    }
  ];

  constructor(private skillCreditService: SkillCreditService) {}

  ngOnInit(): void {
    this.loadCreditStats();
  }

  private loadCreditStats(): void {
    // Mock data for showcase - in real app, this would come from service
    this.creditStats = {
      totalEarned: 1250,
      availableCredits: 850,
      conversionRate: 0.1,
      sampleCredits: [
        {
          id: 1,
          userId: 1,
          amount: 500,
          source: SkillCreditSource.CERTIFICATION,
          sourceId: 1,
          earnedDate: new Date(),
          status: SkillCreditStatus.ACTIVE,
          description: 'Certification Angular Developer',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          userId: 1,
          amount: 200,
          source: SkillCreditSource.TRAINING,
          sourceId: 2,
          earnedDate: new Date(),
          status: 'ACTIVE' as any,
          description: 'Formation React Avancé',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    };
  }

  getConversionValue(credits: number): number {
    return credits * this.creditStats.conversionRate;
  }
}
