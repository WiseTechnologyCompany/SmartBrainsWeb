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
  options: any;
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.data = {
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
            data: [540, 325, 702, 100, 600, 400, 300, 200, 150, 100],
            backgroundColor: [
              '#4CAF50',
              '#FF9800',
              '#2196F3',
              '#9C27B0',
              '#E91E63',
              '#009688',
              '#3F51B5',
              '#F44336',
              '#607D8B',
              '#9E9E9E'
            ],

            hoverBackgroundColor: [
              '#66BB6A',
              '#FFB74D',
              '#64B5F6',
              '#BA68C8',
              '#F06292',
              '#4DB6AC',
              '#7986CB',
              '#EF5350',
              '#90A4AE',
              '#BDBDBD'
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
      
      this.cd.markForCheck();
    }
  }
}
