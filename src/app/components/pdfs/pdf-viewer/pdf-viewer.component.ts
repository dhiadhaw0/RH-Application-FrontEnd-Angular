import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from '../../../services/pdf.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PdfViewerComponent implements OnInit {
  applicationId: number = 0;
  loading = true;
  error = '';
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private pdfService: PdfService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.applicationId = +params['id'];
      if (this.applicationId) {
        this.loadPdf();
      }
    });
  }

  loadPdf(): void {
    this.loading = true;
    this.error = '';

    this.pdfService.downloadPdf(this.applicationId).subscribe({
      next: (blob) => {
        this.createPdfUrl(blob);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading PDF:', error);
        this.error = 'Erreur lors du chargement du PDF';
        this.loading = false;
        // Load mock PDF for demo
        this.loadMockPdf();
      }
    });
  }

  private createPdfUrl(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private loadMockPdf(): void {
    // Mock PDF URL for demonstration
    const mockPdfUrl = 'data:application/pdf;base64,JVBERi0xLjMKJeLjz9MKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dF0KL0ZvbnQgPDwKL0YxIDYgMCBSCj4+Cj4+Cj4+CmVuZG9iagoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTggVGYKMCAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCgp4cmVmCjAgNwoKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTYKJSVFT0YK';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mockPdfUrl);
    this.loading = false;
  }

  downloadPdf(): void {
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

  goBack(): void {
    window.history.back();
  }
}