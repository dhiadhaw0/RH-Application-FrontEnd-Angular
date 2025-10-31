import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ApplicationService } from '../../../services/application.service';
import { DocumentService } from '../../../services/document.service';
import { Application, StatutCandidature } from '../../../models/application.model';
import { Document } from '../../../models/document.model';
import { Interview } from '../../../models/interview.model';
import { TestEvaluation } from '../../../models/test-evaluation.model';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent]
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | null = null;
  documents: Document[] = [];
  interviews: Interview[] = [];
  testEvaluations: TestEvaluation[] = [];
  selectedStatus: StatutCandidature | string = '';
  statusOptions = Object.values(StatutCandidature);
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private documentService: DocumentService
  ) {}

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
        this.selectedStatus = application.status;
        this.loadRelatedData(id);
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.loading = false;
      }
    });
  }

  loadRelatedData(applicationId: number): void {
    // Load documents
    this.documentService.getDocumentsByApplication(applicationId).subscribe({
      next: (documents) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });

    // Load interviews (assuming we have a method for this)
    // this.applicationService.getInterviewsByApplication(applicationId).subscribe...

    // Load test evaluations (assuming we have a method for this)
    // this.applicationService.getTestEvaluationsByApplication(applicationId).subscribe...

    this.loading = false;
  }

  updateStatus(): void {
    if (!this.application || this.selectedStatus === this.application.status) return;

    if (confirm(`Êtes-vous sûr de vouloir changer le statut en "${this.selectedStatus}" ?`)) {
      this.applicationService.updateApplicationStatus(this.application.idApplication, this.selectedStatus as StatutCandidature).subscribe({
        next: (updatedApplication) => {
          this.application = updatedApplication;
          this.selectedStatus = updatedApplication.status;
          // TODO: Show success message
        },
        error: (error) => {
          console.error('Error updating status:', error);
          // TODO: Show error message
        }
      });
    }
  }

  generateReport(): void {
    if (!this.application) return;

    this.applicationService.generateReport(this.application.idApplication).subscribe({
      next: (application) => {
        // TODO: Handle report generation (download PDF or show modal)
        console.log('Report generated for application:', this.application?.idApplication);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
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

  viewDocument(document: Document): void {
    // TODO: Implement document viewer modal or redirect to viewer
    console.log('View document:', document.name);
  }

  deleteApplication(): void {
    if (!this.application) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.')) {
      this.applicationService.deleteApplication(this.application.idApplication).subscribe({
        next: () => {
          // TODO: Navigate back to applications list with success message
          console.log('Application deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting application:', error);
        }
      });
    }
  }
}