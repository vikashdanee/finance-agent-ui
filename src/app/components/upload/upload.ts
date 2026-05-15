import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AgentService, InvoiceUploadResponse } from '../../services/agent';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class UploadComponent {
  isDragging = false;
  isUploading = false;
  uploadResult: InvoiceUploadResponse | null = null;
  selectedFile: File | null = null;

  constructor(
    private agentService: AgentService,
    private snackBar: MatSnackBar
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.uploadFile(file);
    } else {
      this.snackBar.open('Please upload a PDF file', 'Close',
        { duration: 3000 });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    this.isUploading = true;
    this.uploadResult = null;

    this.agentService.uploadInvoice(file).subscribe({
      next: (result) => {
        this.uploadResult = result;
        this.isUploading = false;
        this.snackBar.open(
          result.anomalyDetected
            ? '⚠️ Invoice uploaded with anomaly detected!'
            : '✅ Invoice uploaded successfully!',
          'Close',
          { duration: 4000 }
        );
      },
      error: (err) => {
        this.isUploading = false;
        this.snackBar.open(
          'Upload failed: ' + (err.error?.message || 'Unknown error'),
          'Close',
          { duration: 4000 }
        );
      }
    });
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  reset() {
    this.uploadResult = null;
    this.selectedFile = null;
  }
}