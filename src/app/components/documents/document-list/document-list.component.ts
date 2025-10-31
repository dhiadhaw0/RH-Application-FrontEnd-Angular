import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
import { TypeDocument } from '../../../models/application.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  applicationId: number = 1; // TODO: Get from route params

  documentTypes = [
    { value: TypeDocument.CV, label: 'CV', icon: '📄' },
    { value: TypeDocument.LETTRE_MOTIVATION, label: 'Lettre de Motivation', icon: '✉️' },
    { value: TypeDocument.PORTFOLIO, label: 'Portfolio', icon: '🎨' },
    { value: TypeDocument.DIPLOME, label: 'Diplôme', icon: '🎓' },
    { value: TypeDocument.CERTIFICATION, label: 'Certification', icon: '🏆' },
    { value: TypeDocument.CONTRAT, label: 'Contrat', icon: '📋' },
    { value: TypeDocument.AUTRE, label: 'Autre', icon: '📎' }
  ];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocumentsByApplication(this.applicationId).subscribe({
      next: (documents) => {
        this.documents = documents;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.loading = false;
        // Load mock data if API fails
        this.loadMockDocuments();
      }
    });
  }

  private loadMockDocuments(): void {
    setTimeout(() => {
      this.documents = [
        {
          idDocument: 1,
          name: 'CV_John_Doe.pdf',
          url: 'mock-url-1',
          mimeType: 'application/pdf',
          description: 'Mon curriculum vitae détaillé',
          fileSize: 245760,
          type: TypeDocument.CV,
          uploadedAt: new Date('2024-01-15'),
          application: { idApplication: 1 } as any
        },
        {
          idDocument: 2,
          name: 'Lettre_Motivation.pdf',
          url: 'mock-url-2',
          mimeType: 'application/pdf',
          description: 'Lettre de motivation pour le poste',
          fileSize: 184320,
          type: TypeDocument.LETTRE_MOTIVATION,
          uploadedAt: new Date('2024-01-15'),
          application: { idApplication: 1 } as any
        },
        {
          idDocument: 3,
          name: 'Diplome_Ingenieur.pdf',
          url: 'mock-url-3',
          mimeType: 'application/pdf',
          description: 'Diplôme d\'ingénieur en informatique',
          fileSize: 512000,
          type: TypeDocument.DIPLOME,
          uploadedAt: new Date('2024-01-16'),
          application: { idApplication: 1 } as any
        }
      ];
      this.loading = false;
    }, 1000);
  }

  downloadDocument(document: Document): void {
    this.documentService.downloadDocument(document.idDocument).subscribe({
      next: (blob) => {
        this.saveBlob(blob, document.name);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
      }
    });
  }

  deleteDocument(document: Document): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${document.name}" ?`)) {
      this.documentService.deleteDocument(document.idDocument).subscribe({
        next: () => {
          this.documents = this.documents.filter(d => d.idDocument !== document.idDocument);
        },
        error: (error) => {
          console.error('Error deleting document:', error);
        }
      });
    }
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getDocumentTypeInfo(type: TypeDocument): any {
    return this.documentTypes.find(dt => dt.value === type) || this.documentTypes[this.documentTypes.length - 1];
  }

  getFileSizeDisplay(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  trackByDocumentId(index: number, document: Document): number {
    return document.idDocument;
  }
}