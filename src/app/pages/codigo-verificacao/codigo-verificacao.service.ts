import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface CodigoVerificacaoDTO {
  email: string;
  codigo: string;
}

@Injectable({
  providedIn: 'root',
})
export class CodigoVerificacaoService {
  private readonly URL = `${environment.API_URL}`;

  constructor(private httpClient: HttpClient) {}

  async checkEmailAndVerificationCode(
    codigoVerificacaoDTO: CodigoVerificacaoDTO): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpClient.post<boolean>(
        `${this.URL}/codigo/verification`,
        codigoVerificacaoDTO
      )
    );

    return response;
  }
}
