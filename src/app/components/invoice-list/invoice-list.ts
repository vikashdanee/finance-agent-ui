import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { AgentService, Invoice } from '../../services/agent';
import { ApprovalDialogComponent } from '../approval-dialog/approval-dialog';
import { AuditTrailComponent } from '../audit-trail/audit-trail';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    AuditTrailComponent,
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss'
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns = [
    'invoiceNumber', 'vendorName', 'totalAmount',
    'invoiceDate', 'category', 'status', 'anomaly', 'actions'
  ];

  get totalSpend(): number {
    return this.invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  }
  get anomalyCount(): number {
    return this.invoices.filter(i => i.anomalyFlag).length;
  }
  get pendingCount(): number {
    return this.invoices.filter(i => i.status === 'PENDING').length;
  }
  get paidCount(): number {
    return this.invoices.filter(i => i.status === 'PAID').length;
  }

  constructor(
    private agentService: AgentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() { this.loadInvoices(); }

  loadInvoices() {
    this.agentService.getAllInvoices().subscribe({
      next: (invoices) => this.invoices = invoices
    });
  }

  openApproval(invoice: Invoice, action: 'approve' | 'reject') {
    const ref = this.dialog.open(ApprovalDialogComponent, {
      data: { invoice, action },
      width: '520px'
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const request = { comment: result.comment, actionedBy: result.actionedBy };
      const call$ = action === 'approve'
        ? this.agentService.approveInvoice(invoice.id, request)
        : this.agentService.rejectInvoice(invoice.id, request);

      call$.subscribe({ next: () => this.loadInvoices() });
    });
  }

  canApprove(invoice: Invoice): boolean {
    return invoice.status === 'PENDING' || invoice.status === 'ANOMALY';
  }

  canReject(invoice: Invoice): boolean {
    return invoice.status === 'PENDING' ||
           invoice.status === 'APPROVED' ||
           invoice.status === 'ANOMALY';
  }
}