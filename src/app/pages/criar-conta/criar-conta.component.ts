import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { EmailValidator } from '../../../utils/validators/EmailValidator';
import { HttpClient } from '@angular/common/http';

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
  readonly email = new FormControl('', [Validators.required,  EmailValidator.emailValidator]);

  isEditable = true;
  hide = signal(true);

  formGroupDadosPessoais: FormGroup;
  formGroupLogin: FormGroup;

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private readonly httpClient: HttpClient, private readonly _formBuilder: FormBuilder) {
    this.formGroupDadosPessoais = this._formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      profissao: ['', Validators.required],
      empresa: ['', Validators.required],
      estadoCivil: ['', Validators.required],
    });

    this.formGroupLogin = this._formBuilder.group({
      email: ['', [Validators.required, EmailValidator.emailValidator]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    });
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
  }

  verificarFormGroupLogin() {
    this.formGroupLogin.markAllAsTouched();
  }
}
