import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ApplicationService } from '../../../services/application.service';
import { UserService } from '../../../services/user.service';
import { JobOfferService } from '../../../services/job-offer.service';
import { User } from '../../../models/user.model';
import { JobOffer } from '../../../models/job-offer.model';

@Component({
  selector: 'app-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent]
})
export class ApplicationCreateComponent implements OnInit {
  applicationForm: FormGroup;
  availableUsers: User[] = [];
  availableJobOffers: JobOffer[] = [];
  uploadedFiles: File[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private applicationService: ApplicationService,
    private userService: UserService,
    private jobOfferService: JobOfferService
  ) {
    this.applicationForm = this.fb.group({
      jobOfferId: ['', Validators.required],
      userId: ['', Validators.required],
      motivationLetter: ['', [Validators.maxLength(2000)]],
      coverLetter: ['', [Validators.maxLength(1500)]]
    });
  }

  ngOnInit(): void {
    this.loadAvailableData();
  }

  loadAvailableData(): void {
    // Load available users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });

    // Load available job offers
    this.jobOfferService.getAllJobOffers().subscribe({
      next: (jobOffers) => {
        this.availableJobOffers = jobOffers;
      },
      error: (error) => {
        console.error('Error loading job offers:', error);
      }
    });
  }

  getSelectedJobOffer(): JobOffer | undefined {
    const jobOfferId = this.applicationForm.get('jobOfferId')?.value;
    return this.availableJobOffers.find(offer => offer.idJobOffer === +jobOfferId);
  }

  getSelectedUser(): User | undefined {
    const userId = this.applicationForm.get('userId')?.value;
    return this.availableUsers.find(user => user.id === +userId);
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
    // Filter for allowed file types and size limits
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

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.isSubmitting = true;

      const formValue = this.applicationForm.value;
      const applicationData = {
        motivationLetter: formValue.motivationLetter,
        coverLetter: formValue.coverLetter
      };

      this.applicationService.createApplication(+formValue.jobOfferId, applicationData).subscribe({
        next: (createdApplication) => {
          // TODO: Upload documents if any
          if (this.uploadedFiles.length > 0) {
            this.uploadDocuments(createdApplication.idApplication);
          } else {
            this.router.navigate(['/applications', createdApplication.idApplication]);
          }
        },
        error: (error) => {
          console.error('Error creating application:', error);
          this.isSubmitting = false;
          // TODO: Show error message
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.applicationForm.controls).forEach(key => {
        this.applicationForm.get(key)?.markAsTouched();
      });
    }
  }

  uploadDocuments(applicationId: number): void {
    // TODO: Implement document upload for each file
    // For now, just navigate to the created application
    this.router.navigate(['/applications', applicationId]);
  }
}