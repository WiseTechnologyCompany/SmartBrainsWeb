import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { GlobalFormats } from '../../utils/formats/GlobalFormats';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { EditarUsuarioService, UsuarioDTO } from './editar-usuario.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
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
export class EditarUsuarioComponent implements OnInit {
  isEditable = true;
  formGroupDadosPessoais: FormGroup;

  async ngOnInit(): Promise<void> {
    const usuarioDTO = await this.editarUsuarioService.getUsuario();
    this.formGroupDadosPessoais.patchValue(usuarioDTO);
  }

  constructor(
    private readonly router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly editarUsuarioService: EditarUsuarioService
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

  verificarFormGroupDadosPessoais() {
    const emailControl = this.formGroupDadosPessoais.get('email');

    if (emailControl?.invalid) {
      emailControl.markAsTouched();
      this.formGroupDadosPessoais.markAllAsTouched();
      return;
    }

    this.formGroupDadosPessoais.markAllAsTouched();
    this.editarUsuarioService.updateUsuario(this.createBodyUser());
    this.formGroupDadosPessoais.get('dataNascimento')?.setErrors(null);
  }

  private createBodyUser(): UsuarioDTO {
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

  async verificarEmailExistente() {
    const emailControl = this.formGroupDadosPessoais.get('email');

    if (emailControl && emailControl.valid) {
      const existe = await this.editarUsuarioService.checkEmail(emailControl.value);

      if (existe) {
        emailControl.setErrors({ emailJaCadastrado: true });
      }
    }
  }
}
