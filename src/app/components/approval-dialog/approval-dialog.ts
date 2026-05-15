import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Invoice } from '../../services/agent';

export interface DialogData {
  invoice: Invoice;
  action: 'approve' | 'reject';
}

@Component({
  selector: 'app-approval-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-wrapper">
      <div class="dialog-header" [class.approve]="data.action === 'approve'"
           [class.reject]="data.action === 'reject'">
        <mat-icon>{{ data.action === 'approve' ? 'check_circle' : 'cancel' }}</mat-icon>
        <h2>{{ data.action === 'approve' ? 'Approve' : 'Reject' }} Invoice</h2>
      </div>

      <mat-dialog-content>
        <div class="invoice-summary">
          <div class="summary-row">
            <span class="label">Invoice #</span>
            <span class="value">{{ data.invoice.invoiceNumber }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Vendor</span>
            <span class="value">{{ data.invoice.vendorName }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Amount</span>
            <span class="value amount">{{ data.invoice.totalAmount | currency }}</span>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Your Name</mat-label>
          <input matInput [(ngModel)]="actionedBy"
                 placeholder="Enter your name">
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>
            {{ data.action === 'approve' ? 'Approval Note (optional)' : 'Rejection Reason (required)' }}
          </mat-label>
          <textarea matInput [(ngModel)]="comment"
                    rows="3"
                    placeholder="{{ data.action === 'approve'
                      ? 'Add any notes about this approval...'
                      : 'Please explain why this invoice is being rejected...' }}">
          </textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button
                [color]="data.action === 'approve' ? 'primary' : 'warn'"
                (click)="onConfirm()"
                [disabled]="data.action === 'reject' && !comment.trim()">
          <mat-icon>{{ data.action === 'approve' ? 'check' : 'close' }}</mat-icon>
          {{ data.action === 'approve' ? 'Approve Invoice' : 'Reject Invoice' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper { min-width: 480px; }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 12px;
      margin: -24px -24px 16px;

      h2 { margin: 0; font-size: 20px; font-weight: 600; }
      mat-icon { font-size: 28px; width: 28px; height: 28px; }

      &.approve { background: #e8f5e9; color: #2e7d32; }
      &.reject  { background: #fce4ec; color: #c62828; }
    }

    .invoice-summary {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 14px;

        .label { color: #666; }
        .value { font-weight: 500; }
        .amount { color: #1565c0; font-size: 16px; font-weight: 700; }
      }
    }

    .full-width { width: 100%; margin-bottom: 8px; }
  `]
})
export class ApprovalDialogComponent {
  comment = '';
  actionedBy = '';

  constructor(
    public dialogRef: MatDialogRef<ApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel() { this.dialogRef.close(); }

  onConfirm() {
    this.dialogRef.close({
      comment: this.comment,
      actionedBy: this.actionedBy || 'Anonymous'
    });
  }
}