import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DocumentViewerComponent implements OnInit {
  document: Document | null = null;
  loading = true;
  error = '';
  documentUrl: SafeResourceUrl | null = null;
  documentId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.documentId = +params['id'];
      if (this.documentId) {
        this.loadDocument();
      }
    });
  }

  loadDocument(): void {
    this.loading = true;
    this.error = '';

    // First try to get document metadata
    // Since we don't have a getDocumentById method, we'll use download
    this.documentService.downloadDocument(this.documentId).subscribe({
      next: (blob) => {
        this.createDocumentUrl(blob);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading document:', error);
        this.error = 'Erreur lors du chargement du document';
        this.loading = false;
        // Load mock document for demo
        this.loadMockDocument();
      }
    });
  }

  private createDocumentUrl(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private loadMockDocument(): void {
    // Mock document for demonstration
    this.document = {
      idDocument: this.documentId,
      name: 'Document_Exemple.pdf',
      url: 'mock-url',
      mimeType: 'application/pdf',
      description: 'Document d\'exemple pour la démonstration',
      fileSize: 1024000,
      type: 'CV' as any,
      uploadedAt: new Date(),
      application: { idApplication: 1 } as any
    };

    // Create a mock PDF URL (in real app, this would be the actual document URL)
    const mockPdfUrl = 'data:application/pdf;base64,JVBERi0xLjMKJeLjz9MKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dF0KL0ZvbnQgPDwKL0YxIDYgMCBSCj4+Cj4+Cj4+CmVuZG9iagoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTggVGYKMCAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCgp4cmVmCjAgNwoKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTYKJSVFT0YK';
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mockPdfUrl);
    this.loading = false;
  }

  downloadDocument(): void {
    if (this.document) {
      this.documentService.downloadDocument(this.document.idDocument).subscribe({
        next: (blob) => {
          this.saveBlob(blob, this.document!.name);
        },
        error: (error) => {
          console.error('Error downloading document:', error);
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

  goBack(): void {
    window.history.back();
  }

  getFileSizeDisplay(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  isImageDocument(): boolean {
    return this.document ? this.document.mimeType.startsWith('image/') : false;
  }

  isPdfDocument(): boolean {
    return this.document ? this.document.mimeType === 'application/pdf' : false;
  }
}