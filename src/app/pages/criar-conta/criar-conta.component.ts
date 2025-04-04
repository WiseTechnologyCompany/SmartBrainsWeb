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
import { EmailValidator } from '../../utils/validators/EmailValidator';
import { SuccessMessages } from '../../utils/messages/SuccessMessages';
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
  readonly email = new FormControl('', [Validators.required, EmailValidator.emailValidator]);

  isEditable = true;
  hide = signal(true);

  formGroupDadosPessoais: FormGroup;
  formGroupLogin: FormGroup;

  constructor(private readonly router: Router, private readonly httpClient: HttpClient, private readonly _formBuilder: FormBuilder) {
    this.formGroupDadosPessoais = this._formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      profissao: ['', Validators.required],
      empresa: ['', Validators.required],
      estadoCivil: ['', Validators.required]
    });

    this.formGroupLogin = this._formBuilder.group({
      email: new FormControl({ value: this.email.value, disabled: true }, { nonNullable: true }),
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    });    
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
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
    console.log(this.email.value);
  }

  verificarFormGroupLogin() {
    this.formGroupLogin.markAllAsTouched();
  }

  sendData() {
    this.sendLoginData();
    this.sendUserData();
  }

  sendUserData() {
    if (this.formGroupDadosPessoais.invalid) {
      return;
    }
    const body = this.createBodyUser();
    this.saveUserRequest(body);
  }

  sendLoginData() {
    if (this.formGroupLogin.invalid) {
      return;
    }
    const body = this.createBodyLogin();
    this.saveLoginRequest(body);
  }

  private createBodyUser() {
    return {
      nome: this.formGroupDadosPessoais.get('nome')?.value,
      sobrenome: this.formGroupDadosPessoais.get('sobrenome')?.value,
      dataNascimento: this.formGroupDadosPessoais.get('dataNascimento')?.value,
      cpf: this.formGroupDadosPessoais.get('cpf')?.value,
      telefone: this.formGroupDadosPessoais.get('telefone')?.value,
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
