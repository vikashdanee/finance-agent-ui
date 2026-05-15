import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AgentService, InvoiceStats } from '../../services/agent';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  stats: InvoiceStats | null = null;
  categoryChart: Chart | null = null;
  vendorChart: Chart | null = null;
  statusChart: Chart | null = null;

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    this.agentService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        setTimeout(() => this.buildCharts(), 100);
      }
    });
  }

  buildCharts() {
    if (!this.stats) return;
    this.buildCategoryChart();
    this.buildVendorChart();
    this.buildStatusChart();
  }

  buildCategoryChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx || !this.stats) return;
    const labels = Object.keys(this.stats.categorySpend);
    const data   = Object.values(this.stats.categorySpend);
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#3949ab','#1e88e5','#00acc1',
            '#43a047','#fb8c00','#e53935','#8e24aa'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: false }
        }
      }
    });
  }

  buildVendorChart() {
    const ctx = document.getElementById('vendorChart') as HTMLCanvasElement;
    if (!ctx || !this.stats) return;
    const labels = Object.keys(this.stats.vendorSpend);
    const data   = Object.values(this.stats.vendorSpend);
    this.vendorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Spend ($)',
          data,
          backgroundColor: '#3949ab',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + Number(value).toLocaleString()
            }
          }
        }
      }
    });
  }

  buildStatusChart() {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx || !this.stats) return;
    const labels = Object.keys(this.stats.statusCounts);
    const data   = Object.values(this.stats.statusCounts);
    this.statusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#fb8c00','#43a047','#e53935','#1e88e5','#e53935'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
