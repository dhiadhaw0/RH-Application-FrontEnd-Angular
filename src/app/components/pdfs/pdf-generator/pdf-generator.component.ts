import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PdfGeneratorComponent {
  applicationId: number = 1; // TODO: Get from route params
  generating = false;
  generationSuccess = false;
  generationError = '';

  constructor(private pdfService: PdfService) {}

  generatePdf(): void {
    this.generating = true;
    this.generationError = '';
    this.generationSuccess = false;

    this.pdfService.generatePdf(this.applicationId).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `application-${this.applicationId}.pdf`);
        this.generating = false;
        this.generationSuccess = true;
      },
      error: (error) => {
        console.error('Error generating PDF:', error);
        this.generating = false;
        this.generationError = 'Erreur lors de la génération du PDF.';
      }
    });
  }

  downloadExistingPdf(): void {
    this.pdfService.downloadPdf(this.applicationId).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `application-${this.applicationId}.pdf`);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
      }
    });
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}