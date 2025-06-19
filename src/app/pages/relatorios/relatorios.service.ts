import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface TotalEntradaSaidaPorAnoDTO {
  totalEntrada: number;
  totalSaida: number;
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
    const response = await firstValueFrom(
      this.httpClient.get<TotalEntradaSaidaPorAnoDTO>(
        `${this.URL}/movimentacao/total-entrada-saida-por-ano`
      )
    );

    return response;
  }
}
