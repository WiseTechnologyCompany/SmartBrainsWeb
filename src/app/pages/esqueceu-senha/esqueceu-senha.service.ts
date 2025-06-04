import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

export interface UserEmailDTO {
  email: string;
}

export interface CodigoVerificacaoDTO {
  email: string;
  codigo: string;
}

@Injectable({
  providedIn: 'root',
})
export class EsqueceuSenhaService {
  private readonly URL = `${environment.API_URL}`;

  constructor(private readonly router: Router, private httpClient: HttpClient) {}

  async checkEmail(email: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpClient.post<{ emailAlreadyExists: boolean }>(
        `${this.URL}/auth/check/email`,
        { email }
      )
    );

    return response.emailAlreadyExists;
  }

  async sendEmail(userEmailDTO: UserEmailDTO): Promise<void> {
    const response = await firstValueFrom(
      this.httpClient.post<boolean>(`${this.URL}/codigo/send`, userEmailDTO, {
        observe: 'response',
      })
    );

    if (response.status === 200) {
      Swal.fire({
        title: 'Sucesso!',
        text: 'Enviamos um Código de Verificação para o e-mail informado. Por favor, verifique sua caixa de entrada ou a pasta de spam.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#76a7b9',
      }).then(() => {
        this.router.navigate(['/codigo-verificacao']);
      });
    } else {
      Swal.fire({
        title: 'Oops!',
        text: 'Ocorreu um erro ao enviar o e-mail. Por favor, tente novamente mais tarde.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#76a7b9',
      });
    }
  }
}