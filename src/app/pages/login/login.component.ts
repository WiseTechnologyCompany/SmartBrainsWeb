import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsuarioInfoDTO } from './usuarioInfoDTO';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/Environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorMessages } from '../../utils/messages/ErrorMessages';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  hide = true;
  private readonly URL = `${environment.API_URL}`;
  readonly password = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, GlobalValidators.emailValidator]);

  constructor(private readonly httpClient: HttpClient, private readonly router: Router) {}

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  async sendData() {
    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    const body = this.createBody();
    await this.createRequest(body);
  }

  private createBody() {
    return {
      email: this.email.value,
      password: this.password.value,
    };
  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Por favor, digite um e-mail!';
    }

    if (this.email.hasError('invalidEmail')) {
      return 'Por favor, digite um e-mail válido!';
    }

    return '';
  }

  getSenhaError(): string {
    return this.password.hasError('required') ? 'Por favor, digite uma senha!' : '';
  }

  private async createRequest(body: any) {
    try {
      const response = await firstValueFrom(this.httpClient.post<{ access_token: string }>(`${this.URL}/auth`, body));
  
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
  
      const usuarioInfo = await this.getUsuarioInfo(body.email);
  
      this.router.navigate(['/dashboard'], {
        queryParams: {
          nome: usuarioInfo.nome,
          profissao: usuarioInfo.profissao,
          empresa: usuarioInfo.empresa
        }
      });
    } catch (error) {
      ErrorMessages.loginErrorMessage();
    }
  }

  private async getUsuarioInfo(email: string): Promise<UsuarioInfoDTO> {
      const response = await firstValueFrom(this.httpClient.post<UsuarioInfoDTO>(`${this.URL}/usuarios/info`, { email: email }));

      const nome = response.nome;
      const profissao = response.profissao;
      const empresa = response.empresa;

      return { nome, profissao, empresa };
  }
}