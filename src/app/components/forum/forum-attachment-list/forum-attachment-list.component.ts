import { Component, Input, OnInit } from '@angular/core';
import { ForumAttachment } from '../../../models/forum-attachment.model';

@Component({
  selector: 'app-forum-attachment-list',
  templateUrl: './forum-attachment-list.component.html',
  styleUrl: './forum-attachment-list.component.scss'
})
export class ForumAttachmentListComponent implements OnInit {
  @Input() attachments: ForumAttachment[] = [];
  @Input() canDelete = false;
  @Input() maxDisplay = 5;

  displayedAttachments: ForumAttachment[] = [];
  hiddenCount = 0;
  showAll = false;

  ngOnInit(): void {
    this.updateDisplayedAttachments();
  }

  ngOnChanges(): void {
    this.updateDisplayedAttachments();
  }

  private updateDisplayedAttachments(): void {
    if (this.showAll || this.attachments.length <= this.maxDisplay) {
      this.displayedAttachments = [...this.attachments];
      this.hiddenCount = 0;
    } else {
      this.displayedAttachments = this.attachments.slice(0, this.maxDisplay);
      this.hiddenCount = this.attachments.length - this.maxDisplay;
    }
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
    this.updateDisplayedAttachments();
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const iconMap: { [key: string]: string } = {
      'pdf': 'fas fa-file-pdf',
      'doc': 'fas fa-file-word',
      'docx': 'fas fa-file-word',
      'xls': 'fas fa-file-excel',
      'xlsx': 'fas fa-file-excel',
      'ppt': 'fas fa-file-powerpoint',
      'pptx': 'fas fa-file-powerpoint',
      'txt': 'fas fa-file-alt',
      'jpg': 'fas fa-file-image',
      'jpeg': 'fas fa-file-image',
      'png': 'fas fa-file-image',
      'gif': 'fas fa-file-image',
      'zip': 'fas fa-file-archive',
      'rar': 'fas fa-file-archive',
      'mp3': 'fas fa-file-audio',
      'mp4': 'fas fa-file-video',
      'avi': 'fas fa-file-video'
    };

    return iconMap[extension || ''] || 'fas fa-file';
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadAttachment(attachment: ForumAttachment): void {
    // Implement download logic using the service
    console.log('Downloading attachment:', attachment.filename);
    // This would typically call a service to download the file
    // For now, we'll simulate the download
    // this.attachmentService.downloadAttachment(attachment.filename).subscribe(blob => {
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = attachment.originalFilename;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // });
  }

  deleteAttachment(attachment: ForumAttachment): void {
    // Implement delete logic
    console.log('Deleting attachment:', attachment.id);
    // This would typically emit an event to parent component
  }

  isImage(fileName: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension || '');
  }
}

