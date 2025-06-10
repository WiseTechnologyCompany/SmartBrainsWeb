import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { AtualizarSenhaService, AutenticacaoDTO } from './atualizar-senha.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-atualizar-senha',
  templateUrl: './atualizar-senha.component.html',
  styleUrl: './atualizar-senha.component.scss',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AtualizarSenhaComponent {

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  formGroupSenha: FormGroup;

  constructor(private readonly _formBuilder: FormBuilder, private readonly atualizarSenhaService: AtualizarSenhaService) {
    this.formGroupSenha = this._formBuilder.group({
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

  verificarFormGroupSenha() {
    this.formGroupSenha.markAllAsTouched();

    const email = sessionStorage.getItem('email');
    const senha = this.formGroupSenha.get('senha')?.value;
    const confirmarSenha = this.formGroupSenha.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      this.formGroupSenha.get('confirmarSenha')?.setErrors({ senhaDiferente: true });
      return;
    }

    this.atualizarSenhaService.updatePassword(this.buildBody(email || '', senha))
  }

  buildBody(email: string, senha: string): AutenticacaoDTO {

    const autenticacaoDTO = {
      email: email,
      password: senha
    }

    return autenticacaoDTO;
  }
}
