import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CodigoVerificacaoDTO, CodigoVerificacaoService } from './codigo-verificacao.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-codigo-verificacao',
  templateUrl: './codigo-verificacao.component.html',
  styleUrl: './codigo-verificacao.component.scss',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  providers: [provideNgxMask()],
})
export class CodigoVerificacaoComponent {
  formGroupCodigoVerificacao: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly codigoVerificacaoService: CodigoVerificacaoService
  ) {
    this.formGroupCodigoVerificacao = this._formBuilder.group({
      codigoVerificacao: ['', [Validators.required]],
    });
  }

  async verificarCodigo() {
    this.formGroupCodigoVerificacao.markAllAsTouched();

    if (this.formGroupCodigoVerificacao.valid) {
      const codigoVerificacaValue = this.formGroupCodigoVerificacao.value.codigoVerificacao;
      const codigoVerificacaoDTO = this.buildBody(this.formatVerificationCode(codigoVerificacaValue));
      const response = this.codigoVerificacaoService.checkEmailAndVerificationCode(codigoVerificacaoDTO);
      this.checkResponse(await response);
      return;
    }

    Swal.fire({
      title: 'Oops!',
      text: 'Código de Verificação Inválido! Por favor, verifique o Código digitado e tente novamente.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: 'blue',
    });
  }

  formatVerificationCode(verificationCode: string): string {
    return verificationCode.slice(0, 4) + '-' + verificationCode.slice(4);
  }

  buildBody(code: string): CodigoVerificacaoDTO {
    const email = sessionStorage.getItem('email');

    const codigoVerificacaoDTO = {
      email: email || '',
      codigo: code || '',
    };

    return codigoVerificacaoDTO;
  }

  checkResponse(response: boolean) {
    if (response) {
      Swal.fire({
        title: 'Sucesso!',
        text: 'Código de Verificação Válido! Você será redirecionado para a página de redefinição de senha.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: 'blue',
      }).then(() => {
        this.router.navigate(['/atualizar-senha']);
      });
    } else {
      Swal.fire({
        title: 'Oops!',
        text: 'Código de Verificação Inválido! Por favor, verifique o Código digitado e tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'blue',
      });
    }
  }
}
