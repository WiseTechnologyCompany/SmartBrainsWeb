import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';
import { MatPaginatorIntl } from '@angular/material/paginator';

export interface MovimentacaoDTO {
  id: number;
  tipoMovimentacao: string;
  tipoCategoria: string;
  descricao: string;
  valor: string;
  dataCriacao: Date;
}

export interface TotalTransactionsDTO {
  totalEntrada: number;
  totalGastosFixos: number;
  totalDespesas: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por Página:';

  private readonly API_URL = `${environment.API_URL}` + '/movimentacao';

  constructor(private httpClient: HttpClient) {
    super();
  }

  getEmail(): string {
    return sessionStorage.getItem('email') || '';
  }

  getAllUserTransactions(): Observable<MovimentacaoDTO[]> {
    return this.httpClient.post<MovimentacaoDTO[]>(this.API_URL + '/user/table', {email: this.getEmail()});
  }

  getUserTotalTransactions(): Observable<TotalTransactionsDTO> {
    return this.httpClient.post<TotalTransactionsDTO>(this.API_URL + '/user/card', {email: this.getEmail()});
  }
}
