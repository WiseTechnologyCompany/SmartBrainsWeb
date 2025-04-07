import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { environment } from '../../environments/Environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalFormats } from '../../utils/formats/GlobalFormats';
import { SuccessMessages } from '../../utils/messages/SuccessMessages';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.component.html',
  styleUrl: './criar-conta.component.scss',
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
  readonly email = new FormControl('', [Validators.required, GlobalValidators.emailValidator]);

  isEditable = true;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  formGroupDadosPessoais: FormGroup;
  formGroupLogin: FormGroup;

  constructor(private readonly router: Router, private readonly httpClient: HttpClient, private readonly _formBuilder: FormBuilder) {
    this.formGroupDadosPessoais = this._formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', [Validators.required, GlobalValidators.dataNascimentoValidator]],
      cpf: ['', [Validators.required, GlobalValidators.CPFValidator]],
      telefone: ['', Validators.required],
      profissao: ['', Validators.required],
      empresa: ['', Validators.required],
      estadoCivil: ['', Validators.required]
    });

    this.formGroupLogin = this._formBuilder.group({
      email: new FormControl({ value: this.email.value, disabled: true }, { nonNullable: true }),
      senha: ['', [Validators.required, Validators.minLength(10), GlobalValidators.senhaForteValidator]],
      confirmarSenha: ['', Validators.required]
    }); 
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickEventConfirmPassword(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
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

  verificarFormGroupDadosPessoais() {
    if (this.email.invalid) {
      this.email.markAsTouched();
    }

    this.formGroupDadosPessoais.markAllAsTouched();
    this.formGroupLogin.get('email')?.setValue(this.email.value);
  }

  verificarFormGroupLogin() {
    this.formGroupLogin.markAllAsTouched();
    const senha = this.formGroupLogin.get('senha')?.value;
    const confirmarSenha = this.formGroupLogin.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      this.formGroupLogin.get('senha')?.setErrors({ senhaDiferente: true });
      this.formGroupLogin.get('confirmarSenha')?.setErrors({ senhaDiferente: true });
    }
    
    this.sendData();
  }

  sendData() {
    this.sendLoginData();
    this.sendUserData();
  }

  sendUserData() {
    const body = this.createBodyUser();
    this.saveUserRequest(body);
  }

  sendLoginData() {
    const body = this.createBodyLogin();
    this.saveLoginRequest(body);
  }

  private createBodyUser() {
    return {
      nome: this.formGroupDadosPessoais.get('nome')?.value,
      sobrenome: this.formGroupDadosPessoais.get('sobrenome')?.value,
      dataNascimento: GlobalFormats.formatarData(this.formGroupDadosPessoais.get('dataNascimento')?.value),
      cpf: GlobalFormats.formatarCPF(this.formGroupDadosPessoais.get('cpf')?.value),
      telefone: GlobalFormats.formatarTelefone(this.formGroupDadosPessoais.get('telefone')?.value),
      profissao: this.formGroupDadosPessoais.get('profissao')?.value,
      empresa: this.formGroupDadosPessoais.get('empresa')?.value,
      estadoCivil: this.formGroupDadosPessoais.get('estadoCivil')?.value,
      email: this.email.value || '',
    };
  }

  private createBodyLogin() {
    return {
      email: this.email.value || '',
      senha: this.formGroupLogin.get('senha')?.value
    };
  }

  private getTokenRequest(body: any) {
    this.httpClient.post<{ access_token: string }>(`${this.URL}/usuarios`, body).subscribe({
      next: () => {
        SuccessMessages.loginSuccessMessage();
        this.router.navigate(['/dashboard']);
      },
    });
  }

  private saveUserRequest(body: any) {
    this.httpClient.post(`${this.URL}/auth/save`, body).subscribe({
      next: () => {
        this.getTokenRequest(body);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  private saveLoginRequest(body: any) {
    this.httpClient.post(`${this.URL}/auth/save`, body).subscribe({
      next: () => {
        this.getTokenRequest(body);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
