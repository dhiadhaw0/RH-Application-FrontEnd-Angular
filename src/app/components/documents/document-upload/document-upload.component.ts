import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
import { TypeDocument } from '../../../models/application.model';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DocumentUploadComponent {
  selectedFile: File | null = null;
  selectedType: TypeDocument | null = null;
  description = '';
  applicationId: number = 1; // TODO: Get from route params or service
  uploading = false;
  uploadSuccess = false;
  uploadError = '';

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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadError = '';
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.selectedType) {
      this.uploadError = 'Veuillez sélectionner un fichier et un type de document.';
      return;
    }

    this.uploading = true;
    this.uploadError = '';

    this.documentService.uploadDocument(
      this.applicationId,
      this.selectedFile,
      this.selectedType,
      this.description || undefined
    ).subscribe({
      next: (document) => {
        this.uploading = false;
        this.uploadSuccess = true;
        this.resetForm();
        console.log('Document uploaded successfully:', document);
      },
      error: (error) => {
        this.uploading = false;
        this.uploadError = 'Erreur lors du téléchargement du document.';
        console.error('Upload error:', error);
      }
    });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.selectedType = null;
    this.description = '';
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFileSizeDisplay(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return allowedTypes.includes(file.type);
  }
}