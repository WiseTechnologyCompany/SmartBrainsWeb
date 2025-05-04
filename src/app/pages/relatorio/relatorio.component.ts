import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MovimentacaoDTO, DashboardService } from '../dashboard/dashboard.service';

@Component({
  standalone: true,
  selector: 'app-relatorio',
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
    RouterModule,
    MatMenuModule
  ],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class RelatorioComponent implements OnInit {

  receita: number = 0;
  entrada: number = 0;
  gastosFixos: number = 0;
  despesas: number = 0;

  displayedColumns: string[] = ['id', 'tipoMovimentacao', 'tipoCategoria', 'descricao', 'valor', 'dataCriacao', 'botoes'];
  dataSource!: MatTableDataSource<MovimentacaoDTO>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly router: Router, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAllUserTransactions().subscribe((movimentacaoDTO: MovimentacaoDTO[]) => {
      this.dataSource = new MatTableDataSource(movimentacaoDTO);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    return sessionStorage.getItem('nome') ?? '';
  }

  getCompany() {
    const profissao = sessionStorage.getItem('profissao') ?? '';
    const empresa = sessionStorage.getItem('empresa') ?? '';
    return `${profissao} - ${empresa}`;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}