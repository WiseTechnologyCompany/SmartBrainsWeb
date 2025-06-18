import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LogoutService } from '../../utils/logout/logout-service';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    ChartModule,
  ],
})
export class RelatoriosComponent implements OnInit {
  constructor(
    private logoutService: LogoutService,
    private cd: ChangeDetectorRef
  ) {}

  getName() {
    return sessionStorage.getItem('nome') ?? '';
  }

  getCompany() {
    const profissao = sessionStorage.getItem('profissao') ?? '';
    const empresa = sessionStorage.getItem('empresa') ?? '';
    return `${profissao} - ${empresa}`;
  }

  logout() {
    this.logoutService.logout();
  }

  data: any;
  categoryData: any;
  basicData: any;
  basicOptions: any;
  options: any;
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      this.data = {
        labels: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ],

        datasets: [
          {
            label: '2025',
            data: [65, 59, 80, 81, 56, 55, 40, 72, 68, 150, 77, 60],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            tension: 0.4,
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };

      this.categoryData = {
        labels: [
          'Salário',
          'Alimentação',
          'Transporte',
          'Moradia',
          'Lazer',
          'Saúde',
          'Educação',
          'Compras',
          'Contas',
          'Outros',
        ],
        datasets: [
          {
            data: [4500, 800, 300, 1200, 400, 250, 500, 700, 600, 150],
            backgroundColor: [
              '#4CAF50',
              '#FFC107',
              '#F44336',
              '#3F51B5',
              '#9C27B0',
              '#EF5350',
              '#2196F3',
              '#EC407A',
              '#9E9E9E',
              '#6D4C41',
            ],
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };

      this.basicData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Sales',
            data: [540, 325, 702, 620],
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgb(107, 114, 128, 0.2)',
              'rgba(139, 92, 246, 0.2)',
            ],
            borderColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };

      this.cd.markForCheck();
    }
  }
}
