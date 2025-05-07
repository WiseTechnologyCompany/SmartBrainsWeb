import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LogoutService } from '../../utils/logout/logout-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AdicionarTransacaoService } from './adicionar-transacao.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-adicionar',
  templateUrl: './adicionar-transacao.component.html',
  styleUrl: './adicionar-transacao.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    RouterModule,
    MatMenuModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class AdicionarComponent {
  formGroupNovaTransacao: FormGroup;

  constructor(
    private logoutService: LogoutService,
    private readonly _formBuilder: FormBuilder,
    private readonly adicionarTransacaoService: AdicionarTransacaoService
  ) {
    this.formGroupNovaTransacao = this._formBuilder.group({
      tipoTransacao: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: ['', Validators.required],
      dataCriacao: ['', Validators.required],
      observacao: [''],
      tipoCategoria: ['', Validators.required],
    });
  }

  getName() {
    return sessionStorage.getItem('nome') ?? '';
  }

  getCompany() {
    const profissao = sessionStorage.getItem('profissao') ?? '';
    const empresa = sessionStorage.getItem('empresa') ?? '';
    return `${profissao} - ${empresa}`;
  }

  verificarFormGroupNovaTransacao() {
    const tipoTransacao = this.formGroupNovaTransacao.get('tipoTransacao')?.value;
    const tipoCategoria = this.formGroupNovaTransacao.get('tipoCategoria')?.value;

    if (!tipoTransacao || tipoTransacao === '') {
      Swal.fire({
        title: 'Oops!',
        text: 'Por favor, selecione o tipo de transação.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: 'blue',
      });

      return;
    }

    if (!tipoCategoria || tipoCategoria === '') {
      Swal.fire({
        title: 'Oops!',
        text: 'Por favor, selecione o tipo de categoria.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: 'blue',
      });

      return;
    }

    this.formGroupNovaTransacao.markAllAsTouched();
    this.sendRequest();

    setTimeout(() => {
     this.formGroupNovaTransacao.reset()}, 500);
  }

  private async sendRequest() {
    const body = await this.createRequestBody();
    this.adicionarTransacaoService.saveNewTransaction(body);
  }

  private async createRequestBody() {
    const usuario = await this.adicionarTransacaoService.getUserIdByEmail();
    const tipoMovimentacao = this.formGroupNovaTransacao.get('tipoTransacao')?.value;
    const tipoCategoria = this.formGroupNovaTransacao.get('tipoCategoria')?.value;
    const descricao = this.formGroupNovaTransacao.get('descricao')?.value;
    const observacao = this.formGroupNovaTransacao.get('observacao')?.value;
    const valor = this.formGroupNovaTransacao.get('valor')?.value;
    const dataCriacao = this.formGroupNovaTransacao.get('dataCriacao')?.value;

    return { usuario, tipoMovimentacao, tipoCategoria, descricao, observacao, valor, dataCriacao, };
  }

  logout() {
    this.logoutService.logout();
  }
}