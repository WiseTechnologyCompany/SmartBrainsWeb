import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface MovimentacaoDTO {
  id: number;
  tipoMovimentacao: string;
  descricao: string;
  valor: number;
  dataCriacao: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = `${environment.API_URL}`;

  constructor(private httpClient: HttpClient) {}

  getEmail(): string {
    return localStorage.getItem('email') || '';
  }

  getUserTransactions(): Observable<MovimentacaoDTO[]> {
    return this.httpClient.post<MovimentacaoDTO[]>(this.API_URL + '/movimentacao/user', {email: this.getEmail()});
  }
}
