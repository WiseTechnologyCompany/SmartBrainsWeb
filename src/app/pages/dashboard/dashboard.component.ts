import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DashboardService, MovimentacaoDTO, TotalTransactionsDTO } from './dashboard.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    RouterModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class DashboardComponent implements OnInit {

  receita: number = 0;
  entrada: number = 0;
  gastosFixos: number = 0;
  despesas: number = 0;

  dataFim: string = '';
  dataInicio: string = '';

  displayedColumns: string[] = ['id', 'tipoMovimentacao', 'descricao', 'valor', 'dataCriacao', 'botoes'];
  dataSource!: MatTableDataSource<MovimentacaoDTO>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly route: ActivatedRoute, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAllUserTransactions().subscribe((movimentacaoDTO: MovimentacaoDTO[]) => {
      this.dataSource = new MatTableDataSource(movimentacaoDTO);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dashboardService.getUserTotalTransactions().subscribe((totalTransactionsDTO: TotalTransactionsDTO) => {
      this.entrada = totalTransactionsDTO.totalEntrada;
      this.gastosFixos = totalTransactionsDTO.totalGastosFixos;
      this.despesas = totalTransactionsDTO.totalDespesas;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getName() {
    return this.route.snapshot.queryParamMap.get('nome');
  }

  getCompany() {
    const profissao = this.route.snapshot.queryParamMap.get('profissao') ?? '';
    const empresa = this.route.snapshot.queryParamMap.get('empresa') ?? '';
    return `${profissao} - ${empresa}`;
  }

  getReceita() { 
    const totalSaida = this.gastosFixos + this.despesas;
    
    if (totalSaida > this.entrada) {
      const resultado = ((this.entrada - totalSaida) / this.entrada) * 100;
      return (resultado + 100).toFixed(2) + '%';
    }
 
    const resultado = this.receita = parseFloat(((this.entrada - totalSaida) / this.entrada * 100).toFixed(2));
    return 100 - resultado + '%';
  }

  getTotalEntrada() {
    return this.entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getTotalGastosFixos() {
    return this.gastosFixos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getTotalDespesas() {
    return this.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getDate() {
    if (!this.dataInicio && !this.dataFim) {
      return '';
    }

    return '| ' + this.dataInicio + ' - ' + this.dataFim;
  }

  saveDate(dataInicio: string, dataFim: string) {
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }
}
