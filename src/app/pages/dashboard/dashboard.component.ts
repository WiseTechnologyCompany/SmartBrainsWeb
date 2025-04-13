import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

export interface movimentacaoDTO {
  id: string;
  tipoMovimentacao: string;
  descricao: string;
  valor: string;
  dataCriacao: string;
}
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
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class DashboardComponent implements AfterViewInit, OnInit {

  ngOnInit() {
    const dadosFicticios: movimentacaoDTO[] = [
      {
        id: '1',
        tipoMovimentacao: 'Entrada',
        descricao: 'Pagamento cliente A',
        valor: '1.200,00',
        dataCriacao: '2025-04-01'
      },
      {
        id: '2',
        tipoMovimentacao: 'Saída',
        descricao: 'Compra de materiais',
        valor: '450,00',
        dataCriacao: '2025-04-02'
      },
      {
        id: '3',
        tipoMovimentacao: 'Entrada',
        descricao: 'Recebimento projeto B',
        valor: '3.000,00',
        dataCriacao: '2025-04-03'
      },
      {
        id: '4',
        tipoMovimentacao: 'Saída',
        descricao: 'Pagamento de aluguel',
        valor: '2.000,00',
        dataCriacao: '2025-04-05'
      },
      {
        id: '5',
        tipoMovimentacao: 'Entrada',
        descricao: 'Venda de produto X',
        valor: '50,00',
        dataCriacao: '2025-04-06'
      },
      {
        id: '6',
        tipoMovimentacao: 'Saída',
        descricao: 'Manutenção de equipamentos',
        valor: '680,00',
        dataCriacao: '2025-04-07'
      },
      {
        id: '7',
        tipoMovimentacao: 'Saída',
        descricao: 'Manutenção de equipamentos',
        valor: '680,00',
        dataCriacao: '2025-04-07'
      },
      {
        id: '8',
        tipoMovimentacao: 'Entrada',
        descricao: 'Recebimento projeto C',
        valor: '1.500,00',
        dataCriacao: '2025-04-08'
      },
      {
        id: '9',
        tipoMovimentacao: 'Saída',
        descricao: 'Compra de software Y',
        valor: '1.200,00',
        dataCriacao: '2025-04-09'
      },
      {
        id: '10',
        tipoMovimentacao: 'Entrada',
        descricao: 'Pagamento cliente D',
        valor: '2.800,00',
        dataCriacao: '2025-04-10'
      },
      {
        id: '11',
        tipoMovimentacao: 'Saída',
        descricao: 'Despesas com marketing',
        valor: '1.000,00',
        dataCriacao: '2025-04-11'
      }
    ];
  
    this.dataSource = new MatTableDataSource(dadosFicticios);
  }

  displayedColumns: string[] = ['id', 'tipoMovimentacao', 'descricao', 'valor', 'dataCriacao'];
  dataSource!: MatTableDataSource<movimentacaoDTO>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
}