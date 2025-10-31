import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificationService } from '../../../services/certification.service';
import { FormationService } from '../../../services/formation.service';
import { Formation } from '../../../models/formation.model';

@Component({
  selector: 'app-certification-generate',
  templateUrl: './certification-generate.component.html',
  styleUrls: ['./certification-generate.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CertificationGenerateComponent implements OnInit {
  formations: Formation[] = [];
  selectedFormationId: number | null = null;
  userId: number = 1; // TODO: Get from authentication service
  loading = false;
  generating = false;

  constructor(
    private certificationService: CertificationService,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.loading = true;
    this.formationService.getAllFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading formations:', error);
        this.loading = false;
      }
    });
  }

  generateCertification(): void {
    if (!this.selectedFormationId) return;

    this.generating = true;
    this.certificationService.generateCertification(this.userId, this.selectedFormationId).subscribe({
      next: (blob) => {
        this.downloadCertification(blob);
        this.generating = false;
      },
      error: (error) => {
        console.error('Error generating certification:', error);
        this.generating = false;
      }
    });
  }

  private downloadCertification(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'certification.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getSelectedFormation(): Formation | undefined {
    return this.formations.find(f => f.idFormation === this.selectedFormationId);
  }

  getCurrentDate(): Date {
    return new Date();
  }
}