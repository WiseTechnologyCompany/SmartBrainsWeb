import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface TotalEntradaSaidaPorAnoDTO {
  totalEntrada: number;
  totalSaida: number;
}

export interface TotalEntradaPorMesDTO {
  mes: string;
  totalEntrada: number;
}
export interface TotalSaidaPorMesDTO {
  mes: string;
  totalSaida: number;
}

export interface TotalCategoriaDTO {
  categoriaId: number;
  categoria: string;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class RelatoriosService {
  private readonly URL = `${environment.API_URL}`;

  constructor(
    private readonly httpClient: HttpClient,
  ) {}

  async getTotalEntradaSaidaPorAno(): Promise<TotalEntradaSaidaPorAnoDTO> {
    const email = sessionStorage.getItem('email') ?? '';

    const response = await firstValueFrom(
      this.httpClient.post<TotalEntradaSaidaPorAnoDTO>(
        `${this.URL}/movimentacao/total`,
        { email: email }
      )
    );

    return response;
  }

   async getTotalEntradaPorMes(): Promise<TotalEntradaPorMesDTO[]> {
    const email = sessionStorage.getItem('email') ?? '';

    const response = await firstValueFrom(
      this.httpClient.post<TotalEntradaPorMesDTO[]>(
        `${this.URL}/movimentacao/total/entrada/mes`,
        { email: email }
      )
    );

    return response;
  }

  async getTotalSaidaPorMes(): Promise<TotalSaidaPorMesDTO[]> {
    const email = sessionStorage.getItem('email') ?? '';

    const response = await firstValueFrom(
      this.httpClient.post<TotalSaidaPorMesDTO[]>(
        `${this.URL}/movimentacao/total/saida/mes`,
        { email: email }
      )
    );

    return response;
  }

  async getTotalCategoria(): Promise<TotalCategoriaDTO[]> {
    const email = sessionStorage.getItem('email') ?? '';

    const response = await firstValueFrom(
      this.httpClient.post<TotalCategoriaDTO[]>(
        `${this.URL}/movimentacao/total/categoria`,
        { email: email }
      )
    );

    return response;
  }
}
