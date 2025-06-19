import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LogoutService } from '../../utils/logout/logout-service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RelatoriosService } from './relatorios.service';

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
    private cd: ChangeDetectorRef,
    private logoutService: LogoutService,
    private relatoriosService: RelatoriosService
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
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

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
            label: 'Entradas - 2025',
            data: [50, 65, 40, 35, 75, 27, 80, 65, 70, 80, 90, 75],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            tension: 0.4,
          },
          {
            label: 'Saídas - 2025',
            data: [28, 48, 40, 19, 86, 27, 90, 39, 80, 40, 60, 50],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-blue-500'),
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
          tooltip: {
            callbacks: {
              label: function (context: { label: string; raw: number }) {
                const value = context.raw || 0;

                const valorFormatado = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value);

                return `${valorFormatado}`;
              },
            },
          },
        },
      };

      this.basicData = {
        labels: ['2025'],
        datasets: [
          {
            data: [6040],
            backgroundColor: ['rgba(228, 5, 5, 0.2)'],
            borderColor: ['rgb(231, 4, 4)'],
            borderWidth: 1,
          },
          {
            data: [8548],
            backgroundColor: ['rgba(3, 194, 29, 0.2)'],
            borderColor: ['rgb(5, 124, 5)'],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            display: false,
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: { raw: any }) {
                return `R$ ${context.raw}`;
              },
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
