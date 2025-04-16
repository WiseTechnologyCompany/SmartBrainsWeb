import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CriarContaService } from './criar-conta.service';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
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
  isEditable = true;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  formGroupDadosPessoais: FormGroup;
  formGroupLogin: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly criarContaService: CriarContaService
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
    await this.criarContaService.saveUser(body);

    this.router.navigate(['/dashboard'], {
      queryParams: {
        nome: body.nome,
        profissao: body.profissao,
        empresa: body.empresa,
      },
    });
  }

  async sendLoginData() {
    const body = this.createBodyLogin();
    await this.criarContaService.saveLogin(body);
    const token = await this.criarContaService.getToken(body);

    sessionStorage.setItem('email', body.email);
    sessionStorage.setItem('access_token', token);

    setTimeout(async () => {
      await this.sendUserData();
    }, 1000);
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

  async verificarEmailExistente() {
    const emailControl = this.formGroupDadosPessoais.get('email');

    if (emailControl && emailControl.valid) {
      const existe = await this.criarContaService.checkEmail(emailControl.value);

      if (existe) {
        emailControl.setErrors({ emailJaCadastrado: true });
      }
    }
  }
}
