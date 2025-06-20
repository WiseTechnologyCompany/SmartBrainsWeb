import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LogoutService } from '../../utils/logout/logout-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DashboardService, MovimentacaoDTO, TotalTransactionsDTO } from './dashboard.service';

@Component({
  standalone: true,
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
    RouterModule,
    MatMenuModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class DashboardComponent implements OnInit {

  receita: number = 0;
  entrada: number = 0;
  gastosFixos: number = 0;
  despesas: number = 0;
  displayedColumns: string[] = ['id', 'tipoMovimentacao', 'tipoCategoria', 'descricao', 'valor', 'dataCriacao', 'botoes'];
  dataSource!: MatTableDataSource<MovimentacaoDTO>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dashboardService: DashboardService, private logoutService: LogoutService) {}

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
    return sessionStorage.getItem('nome') ?? '';
  }

  getCompany() {
    const profissao = sessionStorage.getItem('profissao') ?? '';
    const empresa = sessionStorage.getItem('empresa') ?? '';
    return `${profissao} - ${empresa}`;
  }

  getReceita() { 
    const totalSaida = this.gastosFixos + this.despesas;
  
    if (totalSaida === 0 || totalSaida === null || totalSaida === undefined) {
      return 'R$ 0,00';
    }
    
    if (totalSaida > this.entrada) {
      const resultado = ((this.entrada - totalSaida) / this.entrada) * 100;
      return (resultado + 100).toFixed(2) + '%';
    }
  
    const resultado = parseFloat(((this.entrada - totalSaida) / this.entrada * 100).toFixed(2));
    return (100 - resultado).toFixed(2) + '%';
  }  

  getTotalEntrada() {
    if (this.entrada === 0 || this.entrada === null || this.entrada === undefined) {
      return 'R$ 0,00';
    }

    return this.entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getTotalGastosFixos() {
    if (this.gastosFixos === 0 || this.gastosFixos === null || this.gastosFixos === undefined) {
      return 'R$ 0,00';
    }

    return this.gastosFixos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getTotalDespesas() {
    if (this.despesas === 0 || this.despesas === null || this.despesas === undefined) {
      return 'R$ 0,00';
    }

    return this.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  confirmarExcluir(id: number) {
    Swal.fire({
      title: "Atenção",
      text: "Gostaria de excluir esse transação?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "red",     
      confirmButtonText: "EXCLUIR",
      cancelButtonText: "CANCELAR",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.excluir(id);
      }
    });
  }

  excluir(id: number): void {
    this.dashboardService.deleteTransaction(id).subscribe({
      next: () => { 
        Swal.fire({
          title: "Sucesso!",
          text: "Transação excluída com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "blue",
        }).then(() => {
          location.reload(); 
        });
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocorreu um erro ao excluir a transação, tente novamente!",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
          width: '35%'
        });
      }
    });
  }
  
  logout() {
    this.logoutService.logout();
  }
}
