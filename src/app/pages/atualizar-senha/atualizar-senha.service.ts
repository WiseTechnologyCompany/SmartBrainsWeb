import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface AutenticacaoDTO {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AtualizarSenhaService {
  private readonly URL = `${environment.API_URL}`;

  constructor(private router: Router, private httpClient: HttpClient) {}

  async updatePassword(body: AutenticacaoDTO): Promise<void> {
    const response = await firstValueFrom(
      this.httpClient.patch(`${this.URL}/usuarios/password`, body, {
        observe: 'response',
      })
    );

     if (response.status === 200) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Senha atualizada com sucesso. Você será redirecionado para a página de Login.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#76a7b9',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Não foi possível atualizar a senha no momento. Por favor, tente novamente mais tarde.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#76a7b9',
          });
        }
  }
}
