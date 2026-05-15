import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgentService, Invoice } from '../../services/agent';

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
    MatTooltipModule,
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss'
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns = [
    'invoiceNumber', 'vendorName', 'totalAmount',
    'invoiceDate', 'category', 'status', 'anomaly'
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

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.agentService.getAllInvoices().subscribe({
      next: (invoices) => this.invoices = invoices,
      error: (err) => console.error('Error loading invoices', err)
    });
  }

  updateStatus(invoice: Invoice, status: string) {
    this.agentService.updateInvoiceStatus(invoice.id, status).subscribe({
      next: () => this.loadInvoices()
    });
  }
}