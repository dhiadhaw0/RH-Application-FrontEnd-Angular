import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ApplicationService } from '../../../services/application.service';
import { DocumentService } from '../../../services/document.service';
import { Application, StatutCandidature } from '../../../models/application.model';
import { Document } from '../../../models/document.model';

@Component({
  selector: 'app-application-edit',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent]

})
export class ApplicationEditComponent implements OnInit {
  application: Application | null = null;
  applicationForm: FormGroup;
  existingDocuments: Document[] = [];
  uploadedFiles: File[] = [];
  selectedStatus: StatutCandidature | string = '';
  statusOptions = Object.values(StatutCandidature);
  isSubmitting = false;
  loading = false;

  private originalApplication: Application | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private documentService: DocumentService
  ) {
    this.applicationForm = this.fb.group({
      motivationLetter: ['', [Validators.maxLength(2000)]],
      coverLetter: ['', [Validators.maxLength(1500)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadApplication(+id);
    }
  }

  loadApplication(id: number): void {
    this.loading = true;
    this.applicationService.getApplicationById(id).subscribe({
      next: (application) => {
        this.application = application;
        this.originalApplication = { ...application };
        this.selectedStatus = application.status;

        // Populate form
        this.applicationForm.patchValue({
          motivationLetter: application.motivationLetter || '',
          coverLetter: application.coverLetter || ''
        });

        // Load documents
        this.loadDocuments(id);
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.loading = false;
      }
    });
  }

  loadDocuments(applicationId: number): void {
    this.documentService.getDocumentsByApplication(applicationId).subscribe({
      next: (documents) => {
        this.existingDocuments = documents;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.loading = false;
      }
    });
  }

  hasMotivationLetterChanged(): boolean {
    return this.applicationForm.get('motivationLetter')?.value !== this.originalApplication?.motivationLetter;
  }

  hasCoverLetterChanged(): boolean {
    return this.applicationForm.get('coverLetter')?.value !== this.originalApplication?.coverLetter;
  }

  hasAnyChanges(): boolean {
    return this.hasMotivationLetterChanged() ||
           this.hasCoverLetterChanged() ||
           this.uploadedFiles.length > 0 ||
           this.selectedStatus !== this.application?.status;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.closest('.upload-area')?.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.closest('.upload-area')?.classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.closest('.upload-area')?.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  addFiles(files: File[]): void {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Type de fichier non autorisé: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`Fichier trop volumineux: ${file.name}`);
        return false;
      }
      return true;
    });

    this.uploadedFiles.push(...validFiles);
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  deleteDocument(document: Document): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le document "${document.name}" ?`)) {
      this.documentService.deleteDocument(document.idDocument).subscribe({
        next: () => {
          this.existingDocuments = this.existingDocuments.filter(doc => doc.idDocument !== document.idDocument);
        },
        error: (error) => {
          console.error('Error deleting document:', error);
        }
      });
    }
  }

  downloadDocument(document: Document): void {
    this.documentService.downloadDocument(document.idDocument).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
      }
    });
  }

  updateStatus(): void {
    if (!this.application || this.selectedStatus === this.application.status) return;

    if (confirm(`Êtes-vous sûr de vouloir changer le statut en "${this.selectedStatus}" ?`)) {
      this.applicationService.updateApplicationStatus(this.application.idApplication, this.selectedStatus as StatutCandidature).subscribe({
        next: (updatedApplication) => {
          this.application = updatedApplication;
          // TODO: Show success message
        },
        error: (error) => {
          console.error('Error updating status:', error);
          // TODO: Show error message
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.application || !this.hasAnyChanges()) return;

    this.isSubmitting = true;

    const formValue = this.applicationForm.value;
    const updateData: Partial<Application> = {};

    if (this.hasMotivationLetterChanged()) {
      updateData.motivationLetter = formValue.motivationLetter;
    }

    if (this.hasCoverLetterChanged()) {
      updateData.coverLetter = formValue.coverLetter;
    }

    this.applicationService.updateApplication(this.application.idApplication, updateData).subscribe({
      next: (updatedApplication) => {
        // TODO: Upload new documents if any
        if (this.uploadedFiles.length > 0) {
          this.uploadNewDocuments(updatedApplication.idApplication);
        } else {
          this.router.navigate(['/applications', updatedApplication.idApplication]);
        }
      },
      error: (error) => {
        console.error('Error updating application:', error);
        this.isSubmitting = false;
        // TODO: Show error message
      }
    });
  }

  uploadNewDocuments(applicationId: number): void {
    // TODO: Implement document upload for each file
    // For now, just navigate back
    this.router.navigate(['/applications', applicationId]);
  }
}