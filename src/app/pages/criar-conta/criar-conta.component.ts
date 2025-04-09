import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { environment } from '../../environments/Environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalFormats } from '../../utils/formats/GlobalFormats';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.component.html',
  styleUrl: './criar-conta.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaskDirective,
    MatSelectModule,
  ],
  providers: [provideNgxMask()],
})
export class CriarContaComponent {
  private readonly URL = `${environment.API_URL}`;

  isEditable = true;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  formGroupDadosPessoais: FormGroup;
  formGroupLogin: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly httpClient: HttpClient,
    private readonly _formBuilder: FormBuilder
  ) {
    this.formGroupDadosPessoais = this._formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', [Validators.required, GlobalValidators.dataNascimentoValidator]],
      cpf: ['', [Validators.required, GlobalValidators.CPFValidator]],
      telefone: ['', Validators.required],
      profissao: ['', Validators.required],
      empresa: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      email: ['', [Validators.required, GlobalValidators.emailValidator]],
    });

    this.formGroupLogin = this._formBuilder.group({
      email: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
      senha: ['', [Validators.required, Validators.minLength(10), GlobalValidators.senhaForteValidator]],
      confirmarSenha: ['', Validators.required],
    });
  }

  getEmailError(): string {
    const email = this.formGroupDadosPessoais.get('email');
    if (email?.hasError('required')) {
      return 'O campo e-mail é obrigatório.';
    }

    if (email?.hasError('invalidEmail')) {
      return 'Formato de e-mail inválido.';
    }

    if (email?.hasError('emailJaCadastrado')) {
      return 'Este e-mail já está cadastrado.';
    }
    return '';
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickEventConfirmPassword(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  verificarFormGroupDadosPessoais() {
    const emailControl = this.formGroupDadosPessoais.get('email');

    if (emailControl?.invalid) {
      emailControl.markAsTouched();
      this.formGroupDadosPessoais.markAllAsTouched();
      return;
    }

    this.formGroupDadosPessoais.markAllAsTouched();
    this.formGroupLogin.get('email')?.setValue(emailControl?.value);
  }

  verificarFormGroupLogin() {
    this.formGroupLogin.markAllAsTouched();

    const senha = this.formGroupLogin.get('senha')?.value;
    const confirmarSenha = this.formGroupLogin.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      this.formGroupLogin.get('confirmarSenha')?.setErrors({ senhaDiferente: true });
      return;
    }

    this.sendLoginData();
  }

  async sendUserData() {
    const body = this.createBodyUser();
    await this.saveUserRequest(body);
  }

  async sendLoginData() {
    const body = this.createBodyLogin();
    await this.saveLoginRequest(body);
  }

  private createBodyUser() {
    const dados = this.formGroupDadosPessoais;
    return {
      nome: dados.get('nome')?.value,
      sobrenome: dados.get('sobrenome')?.value,
      email: dados.get('email')?.value,
      cpf: GlobalFormats.formatarCPF(dados.get('cpf')?.value),
      dataNascimento: GlobalFormats.formatarData(dados.get('dataNascimento')?.value),
      profissao: dados.get('profissao')?.value,
      empresa: dados.get('empresa')?.value,
      telefone: GlobalFormats.formatarTelefone(dados.get('telefone')?.value),
      estadoCivil: dados.get('estadoCivil')?.value,
    };
  }

  private createBodyLogin() {
    return {
      email: this.formGroupDadosPessoais.get('email')?.value ?? '',
      password: this.formGroupLogin.get('senha')?.value,
    };
  }

  private async getTokenRequest(body: any) {
    const response = await firstValueFrom(
      this.httpClient.post<{ access_token: string }>(`${this.URL}/auth`, body)
    );

    localStorage.setItem('access_token', response.access_token);

    setTimeout(async () => {
      await this.sendUserData();
    }, 1000);
  }

  private async saveUserRequest(body: any) {
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${access_token}` });

    await firstValueFrom(
      this.httpClient.post(`${this.URL}/usuarios`, body, { headers })
    );

    this.router.navigate(['/dashboard'], {
      queryParams: {
        nome: body.nome,
        profissao: body.profissao,
        empresa: body.empresa,
      },
    });
  }

  private async saveLoginRequest(body: any) {
    await firstValueFrom(this.httpClient.post(`${this.URL}/auth/save`, body));
    await this.getTokenRequest(body);
  }

  async verificarEmailExistente() {
    const emailControl = this.formGroupDadosPessoais.get('email');
    if (emailControl && emailControl.valid) {
      await this.checkEmail(emailControl.value);
    }
  }
  
  private async checkEmail(email: string): Promise<boolean> {
    const response = await firstValueFrom(this.httpClient.post<{ emailAlreadyExists: boolean }>( `${this.URL}/auth/check/email`, { email }));

    if (response.emailAlreadyExists) {
      this.formGroupDadosPessoais.get('email')?.setErrors({ emailJaCadastrado: true });
      return true;
    }

    return false;
  }
}
