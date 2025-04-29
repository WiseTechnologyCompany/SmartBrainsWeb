import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';
import { ErrorMessages } from '../../utils/messages/ErrorMessages';
import { Injectable } from '@angular/core';

export interface UsuarioInfoDTO {
  nome: string;
  profissao: string;
  empresa: string;
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {
  private readonly URL = `${environment.API_URL}`;

  constructor(private readonly httpClient: HttpClient, private readonly router: Router) {}

  async createRequest(body: any) {
    try {
      const response = await firstValueFrom(this.httpClient.post<{ access_token: string }>(`${this.URL}/auth`, body));

      if (response) {
        sessionStorage.setItem('email', body.email);
        sessionStorage.setItem('access_token', response.access_token);
      }

      const usuarioInfo = await this.getUsuarioInfo(body.email);

      this.router.navigate(['/dashboard']);
    } catch (error) {
      ErrorMessages.loginErrorMessage();
    }
  }

  private async getUsuarioInfo(email: string): Promise<UsuarioInfoDTO> {
    const response = await firstValueFrom(this.httpClient.post<UsuarioInfoDTO>(`${this.URL}/usuarios/info`, { email: email }));

    const nome = response.nome;
    const profissao = response.profissao;
    const empresa = response.empresa;

    sessionStorage.setItem('nome', nome);
    sessionStorage.setItem('profissao', profissao);
    sessionStorage.setItem('empresa', empresa);

    return { nome, profissao, empresa };
  }
}
