import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ForumAttachmentService } from '../../../services/forum-attachment.service';
import { ForumAttachment } from '../../../models/forum-attachment.model';

@Component({
  selector: 'app-forum-attachment-upload',
  templateUrl: './forum-attachment-upload.component.html',
  styleUrl: './forum-attachment-upload.component.scss'
})
export class ForumAttachmentUploadComponent {
  @Input() postId: number = 0;
  @Input() maxFileSize = 10 * 1024 * 1024; // 10MB default
  @Input() allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];

  @Output() attachmentUploaded = new EventEmitter<ForumAttachment>();
  @Output() uploadError = new EventEmitter<string>();

  selectedFiles: File[] = [];
  uploading = false;
  uploadProgress = 0;
  dragOver = false;

  // File validation
  maxFiles = 5;
  allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'mp3', 'mp4', 'avi'];

  constructor(private attachmentService: ForumAttachmentService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    input.value = '';
  }

  private handleFiles(fileList: FileList): void {
    const files = Array.from(fileList);

    // Check total file count
    if (this.selectedFiles.length + files.length > this.maxFiles) {
      this.uploadError.emit(`Maximum ${this.maxFiles} fichiers autorisés`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = this.validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      this.uploadError.emit(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      this.selectedFiles.push(...validFiles);
      this.uploadFiles(validFiles);
    }
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `Fichier trop volumineux (max ${this.formatFileSize(this.maxFileSize)})`
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !this.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé: ${extension}`
      };
    }

    return { valid: true };
  }

  private async uploadFiles(files: File[]): Promise<void> {
    if (!this.postId) {
      this.uploadError.emit('ID du post manquant');
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('postId', this.postId.toString());

        const attachment = await this.attachmentService.uploadAttachment(this.postId, file).toPromise();
        this.attachmentUploaded.emit(attachment);
        this.uploadProgress = ((i + 1) / files.length) * 100;
      }

      // Clear selected files after successful upload
      this.selectedFiles = this.selectedFiles.filter(file =>
        !files.some(uploadedFile => uploadedFile.name === file.name && uploadedFile.size === file.size)
      );

    } catch (error) {
      this.uploadError.emit('Erreur lors du téléchargement des fichiers');
      console.error('Upload error:', error);
    } finally {
      this.uploading = false;
      this.uploadProgress = 0;
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const iconMap: { [key: string]: string } = {
      'pdf': 'fas fa-file-pdf',
      'doc': 'fas fa-file-word',
      'docx': 'fas fa-file-word',
      'jpg': 'fas fa-file-image',
      'jpeg': 'fas fa-file-image',
      'png': 'fas fa-file-image',
      'gif': 'fas fa-file-image',
      'zip': 'fas fa-file-archive',
      'rar': 'fas fa-file-archive',
      'txt': 'fas fa-file-alt',
      'mp3': 'fas fa-file-audio',
      'mp4': 'fas fa-file-video',
      'avi': 'fas fa-file-video'
    };

    return iconMap[extension || ''] || 'fas fa-file';
  }
}
