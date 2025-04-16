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
import { DashboardService, MovimentacaoDTO } from './dashboard.service';
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

  displayedColumns: string[] = ['id', 'tipoMovimentacao', 'descricao', 'valor', 'dataCriacao'];
  dataSource!: MatTableDataSource<MovimentacaoDTO>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly route: ActivatedRoute, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getUserTransactions().subscribe((movimentacaoDTO: MovimentacaoDTO[]) => {
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
    return this.route.snapshot.queryParamMap.get('nome');
  }

  getCompany() {
    const profissao = this.route.snapshot.queryParamMap.get('profissao') ?? '';
    const empresa = this.route.snapshot.queryParamMap.get('empresa') ?? '';
    return `${profissao} - ${empresa}`;
  }
}
