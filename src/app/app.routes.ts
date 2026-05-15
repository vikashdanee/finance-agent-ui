import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat';
import { InvoiceListComponent } from './components/invoice-list/invoice-list';
import { UploadComponent } from './components/upload/upload';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'upload', component: UploadComponent },
];