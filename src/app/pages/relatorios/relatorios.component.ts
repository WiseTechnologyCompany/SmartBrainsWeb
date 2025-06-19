import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LogoutService } from '../../utils/logout/logout-service';
import { RelatoriosService, TotalCategoriaDTO, TotalEntradaPorMesDTO, TotalSaidaPorMesDTO } from './relatorios.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

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
  totalSaida!: number;
  totalEntrada!: number;
  totalEntradaPorMes: TotalEntradaPorMesDTO[] = [];
  totalSaidaPorMes: TotalSaidaPorMesDTO[] = [];
  totalCategoria: TotalCategoriaDTO[] = [];

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
    this.carregarDados();
  }

  async carregarDados() {
    const [entradaSaidaPorAno, totalEntradaPorMes, totalSaidaPorMes, totalCategoria] = await Promise.all([
      this.relatoriosService.getTotalEntradaSaidaPorAno(),
      this.relatoriosService.getTotalEntradaPorMes(),
      this.relatoriosService.getTotalSaidaPorMes(),
      this.relatoriosService.getTotalCategoria(),
    ]);

    this.totalEntrada = entradaSaidaPorAno.totalEntrada;
    this.totalSaida = entradaSaidaPorAno.totalSaida;
    this.totalEntradaPorMes = totalEntradaPorMes;
    this.totalSaidaPorMes = totalSaidaPorMes;
    this.totalCategoria = totalCategoria;
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      const entradasPorMes = this.totalEntradaPorMes.map((d) => d.totalEntrada);
      const saidasPorMes = this.totalSaidaPorMes.map((d) => d.totalSaida);
      const totalCategorias = this.totalCategoria.map((d) => d.total);

      this.data = {
        labels: this.totalEntradaPorMes.map((d) => d.mes),

        datasets: [
          {
            label: 'Entradas',
            data: entradasPorMes,
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            tension: 0.4,
          },
          {
            label: 'Saídas',
            data: saidasPorMes,
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
            data: totalCategorias,
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
              '#607D8B',
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
            data: [this.totalSaida],
            backgroundColor: ['rgba(220, 53, 69, 0.2)'],
            borderColor: ['#dc3545'],
            borderWidth: 2,
          },
          {
            data: [this.totalEntrada],
            backgroundColor: ['rgba(40, 167, 69, 0.2)'],
            borderColor: ['#28a745'],
            borderWidth: 2,
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
