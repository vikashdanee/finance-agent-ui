import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  category: string;
  status: string;
  description: string;
  anomalyFlag: boolean;
  anomalyReason: string;
  fileName: string;
  createdAt: string;
}

export interface InvoiceUploadResponse {
  invoice: Invoice;
  anomalyDetected: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  chat(message: string, sessionId: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, {
      message,
      sessionId
    });
  }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`);
  }

  uploadInvoice(file: File): Observable<InvoiceUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<InvoiceUploadResponse>(
      `${this.apiUrl}/invoices/upload`, formData
    );
  }

  updateInvoiceStatus(id: number, status: string): Observable<Invoice> {
    return this.http.put<Invoice>(
      `${this.apiUrl}/invoices/${id}/status?status=${status}`, {}
    );
  }
}
