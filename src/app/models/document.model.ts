import { Application, TypeDocument } from './application.model';

export interface Document {
  idDocument: number;
  name: string;
  url: string;
  mimeType: string;
  description?: string;
  fileSize: number;
  type: TypeDocument;
  uploadedAt: string | Date;
  application: Application;
}