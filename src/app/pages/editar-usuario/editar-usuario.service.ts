import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface UsuarioDTO {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  profissao: string;
  empresa: string;
  telefone: string;
  estadoCivil: string;
}

@Injectable({
  providedIn: 'root',
})
export class EditarUsuarioService {
  private readonly API_URL = `${environment.API_URL}` + '/usuarios';

  constructor(private httpClient: HttpClient) {}

  async getUsuarioIdByEmail(email: string): Promise<number> {
    const response = await firstValueFrom(this.httpClient.post<{ id: number }>(`${this.API_URL}/info`, { email }));
    return response.id;
  }

  async getUsuario(): Promise<UsuarioDTO> {
    const email = sessionStorage.getItem('email');
    const usuarioId = await this.getUsuarioIdByEmail(email!);
    const response = await firstValueFrom(this.httpClient.get<UsuarioDTO>(`${this.API_URL + '/' + usuarioId}`));

    return response;
  }

  async checkEmail(email: string): Promise<boolean> {
    const response = await firstValueFrom(this.httpClient.post<{ emailAlreadyExists: boolean }>(`${this.API_URL}/auth/check/email`, { email }));

    return response.emailAlreadyExists;
  }
}
