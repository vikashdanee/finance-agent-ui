import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <div class="toolbar-left">
        <mat-icon class="logo-icon">account_balance</mat-icon>
        <div class="brand">
          <span class="brand-name">Finance Agent</span>
          <span class="brand-sub">AI-Powered Invoice Intelligence</span>
        </div>
      </div>

      <div class="toolbar-right">
        <button mat-button
                routerLink="/chat"
                routerLinkActive="active-nav"
                class="nav-btn">
          <mat-icon>smart_toy</mat-icon>
          <span>AI Chat</span>
        </button>
        <button mat-button
                routerLink="/invoices"
                routerLinkActive="active-nav"
                class="nav-btn">
          <mat-icon>receipt_long</mat-icon>
          <span>Invoices</span>
        </button>
      </div>
    </mat-toolbar>

    <div class="page-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-toolbar {
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
      color: white;
      height: 64px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #90caf9;
    }

    .brand {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 11px;
      opacity: 0.75;
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-btn {
      color: rgba(255,255,255,0.85) !important;
      border-radius: 8px !important;
      padding: 6px 16px !important;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;

      mat-icon { font-size: 18px; }

      &:hover {
        background: rgba(255,255,255,0.12) !important;
        color: white !important;
      }
    }

    .active-nav {
      background: rgba(255,255,255,0.18) !important;
      color: white !important;
      border-bottom: 2px solid #90caf9;
    }

    .page-content {
      padding: 28px 32px;
      max-width: 1300px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {}