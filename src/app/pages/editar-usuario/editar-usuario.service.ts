import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
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
  private readonly API_URL = `${environment.API_URL}`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  async getUsuarioIdByEmail(email: string): Promise<number> {
    const response = await firstValueFrom(this.httpClient.post<{ id: number }>(`${this.API_URL}/usuarios/info`, {email}));

    return response.id;
  }

  async getUsuario(): Promise<UsuarioDTO> {
    const email = sessionStorage.getItem('email');
    const usuarioId = await this.getUsuarioIdByEmail(email!);
    const response = await firstValueFrom(this.httpClient.get<UsuarioDTO>(`${this.API_URL + '/usuarios/' + usuarioId}`));

    return response;
  }

  async updateUsuario(usuarioDTO: UsuarioDTO): Promise<void> {
    const email = sessionStorage.getItem('email');
    const usuarioId = await this.getUsuarioIdByEmail(email!);
    const response = await firstValueFrom(this.httpClient.patch<UsuarioDTO>(`${this.API_URL + '/usuarios/' + usuarioId}`, usuarioDTO));

    if (this.checkIfEmailChanged(email!, usuarioDTO.email)) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuário atualizado com sucesso!',
        showConfirmButton: false,
        timer: 1750,
        width: '32%',
      });

      setTimeout(() => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }, 2000);

      return;
    }

    if (response) {
      sessionStorage.setItem('email', usuarioDTO.email);
      sessionStorage.setItem('nome', usuarioDTO.nome);
      sessionStorage.setItem('empresa', usuarioDTO.empresa);
      sessionStorage.setItem('profissao', usuarioDTO.profissao);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuário atualizado com sucesso!',
        showConfirmButton: false,
        timer: 1750,
        width: '32%',
      });

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    if (email === sessionStorage.getItem('email')) {
      return false;
    }

    const response = await firstValueFrom(
      this.httpClient.post<{ emailAlreadyExists: boolean }>(`${this.API_URL}/auth/check/email`, { email }));

    return response.emailAlreadyExists;
  }

  checkIfEmailChanged(oldEmail: string, newEmail: string): boolean {
    if (oldEmail !== newEmail) {
      return true;
    }

    return false;
  }
}
