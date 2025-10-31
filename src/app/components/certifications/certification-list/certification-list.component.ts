import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certification } from '../../../models/certification.model';

@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CertificationListComponent implements OnInit {
  certifications: Certification[] = [];
  loading = false;

  constructor() {}

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications(): void {
    this.loading = true;
    // TODO: Implement service call to get user certifications
    // For now, using mock data
    setTimeout(() => {
      this.certifications = [
        {
          id: 1,
          dateObtained: new Date('2024-01-15'),
          status: 'OBTENU' as any,
          formation: {
            idFormation: 1,
            title: 'Développement Web Full Stack',
            provider: 'Tech Academy',
            domaine: 'Informatique',
            typeFormation: 'PDF' as any,
            prix: 299.99,
            duree: '120',
            niveau: 'INTERMEDIAIRE',
            active: true,
            noteMoyenne: 4.5
          }
        },
        {
          id: 2,
          dateObtained: new Date('2024-02-20'),
          status: 'OBTENU' as any,
          formation: {
            idFormation: 2,
            title: 'Data Science et Machine Learning',
            provider: 'Data Institute',
            domaine: 'Data Science',
            typeFormation: 'PDF' as any,
            prix: 399.99,
            duree: '150',
            niveau: 'AVANCE',
            active: true,
            noteMoyenne: 4.7
          }
        }
      ];
      this.loading = false;
    }, 1000);
  }

  downloadCertification(certification: Certification): void {
    // TODO: Implement download functionality
    console.log('Downloading certification:', certification.id);
  }

  viewCertification(certification: Certification): void {
    // TODO: Implement view functionality
    console.log('Viewing certification:', certification.id);
  }

  getStatusClass(status: any): string {
    switch (status) {
      case 'OBTENU':
        return 'obtained';
      case 'EN_COURS':
        return 'pending';
      case 'EXPIRE':
        return 'expired';
      default:
        return 'obtained';
    }
  }

  getStatusText(status: any): string {
    switch (status) {
      case 'OBTENU':
        return 'Obtenu';
      case 'EN_COURS':
        return 'En cours';
      case 'EXPIRE':
        return 'Expiré';
      default:
        return 'Obtenu';
    }
  }

  trackByCertificationId(index: number, cert: Certification): number {
    return cert.id;
  }
}