import { Component, Input, OnInit } from '@angular/core';
import { CompanyProfile } from '../../../models/company-profile.model';

@Component({
  selector: 'app-company-gallery',
  standalone: false,
  templateUrl: './company-gallery.component.html',
  styleUrl: './company-gallery.component.scss'
})
export class CompanyGalleryComponent implements OnInit {
  @Input() companyProfile: CompanyProfile | null = null;

  selectedImage: string | null = null;
  selectedVideo: string | null = null;
  showModal = false;

  ngOnInit(): void {}

  openImageModal(image: string): void {
    this.selectedImage = image;
    this.selectedVideo = null;
    this.showModal = true;
  }

  openVideoModal(video: string): void {
    this.selectedVideo = video;
    this.selectedImage = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
    this.selectedVideo = null;
  }

  // Handle keyboard events for modal
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
