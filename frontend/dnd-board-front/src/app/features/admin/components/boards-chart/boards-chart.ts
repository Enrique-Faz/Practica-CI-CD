import { Component, effect, input } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-boards-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="relative w-full h-64">
      <canvas baseChart [data]="barChartData" [options]="barChartOptions" type="bar"></canvas>
    </div>
  `,
})
export class BoardsChart {
  chartData = input<{ date: string; total: number }[]>([]);

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Partidas creadas',
        backgroundColor: 'rgba(217, 119, 6, 0.7)',
        borderColor: 'rgb(217, 119, 6)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#a8a29e' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#a8a29e', stepSize: 1 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  readonly #chartEffect = effect(() => {
    const data = this.chartData();
    if (!data.length) return;
    this.barChartData = {
      ...this.barChartData,
      labels: data.map((d) => d.date),
      datasets: [{ ...this.barChartData.datasets[0], data: data.map((d) => d.total) }],
    };
  });
}
