import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AgentService, AuditLog } from '../../services/agent';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="audit-trail">
      <h4 class="trail-title">
        <mat-icon>history</mat-icon>
        Audit Trail
      </h4>

      @if (logs.length === 0) {
        <p class="empty">No actions recorded yet.</p>
      }

      @for (log of logs; track log.id) {
        <div class="log-entry" [class.approved]="log.action === 'APPROVED'"
             [class.rejected]="log.action === 'REJECTED'">
          <div class="log-icon">
            <mat-icon>
              {{ log.action === 'APPROVED' ? 'check_circle' :
                 log.action === 'REJECTED' ? 'cancel' : 'edit' }}
            </mat-icon>
          </div>
          <div class="log-content">
            <div class="log-header">
              <span class="action">{{ log.action }}</span>
              <span class="by">by {{ log.actionedBy }}</span>
              <span class="time">{{ log.actionedAt | date:'medium' }}</span>
            </div>
            <div class="log-change">
              <span class="status old">{{ log.previousStatus }}</span>
              <mat-icon class="arrow">arrow_forward</mat-icon>
              <span class="status new">{{ log.newStatus }}</span>
            </div>
            @if (log.comment) {
              <div class="log-comment">"{{ log.comment }}"</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .audit-trail {
      padding: 12px 0;

      .trail-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #555;
        margin: 0 0 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .empty {
        color: #999;
        font-size: 13px;
        font-style: italic;
      }

      .log-entry {
        display: flex;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child { border-bottom: none; }

        .log-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #e0e0e0;

          mat-icon { font-size: 18px; }
        }

        &.approved .log-icon { background: #e8f5e9; color: #2e7d32; }
        &.rejected .log-icon { background: #fce4ec; color: #c62828; }

        .log-content {
          flex: 1;

          .log-header {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 4px;

            .action {
              font-weight: 600;
              font-size: 13px;
            }

            .by { font-size: 12px; color: #666; }

            .time {
              font-size: 11px;
              color: #999;
              margin-left: auto;
            }
          }

          .log-change {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;

            .status {
              padding: 2px 8px;
              border-radius: 10px;
              font-weight: 500;

              &.old { background: #f5f5f5; color: #666; }
              &.new { background: #e8f5e9; color: #2e7d32; }
            }

            .arrow { font-size: 14px; color: #999; }
          }

          .log-comment {
            margin-top: 6px;
            font-size: 12px;
            color: #666;
            font-style: italic;
            background: #fafafa;
            padding: 6px 10px;
            border-radius: 6px;
            border-left: 3px solid #ddd;
          }
        }
      }
    }
  `]
})
export class AuditTrailComponent implements OnInit {
  @Input() invoiceId!: number;
  logs: AuditLog[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit() {
  this.loadLogs();
}

loadLogs() {
  this.agentService.getAuditTrail(this.invoiceId).subscribe({
    next: (logs) => this.logs = logs
  });
}
}