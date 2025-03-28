import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
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
    MatSelectModule
  ],
  providers: [
    provideNgxMask()
  ]
})
export class CriarContaComponent {

    isEditable = true;
    formGroupDadosPessoais: FormGroup;
    formGroupLogin: FormGroup;

    constructor(private _formBuilder: FormBuilder) {
      this.formGroupDadosPessoais = this._formBuilder.group({
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        dataNascimento: ['', Validators.required],
        genero: ['', Validators.required],
        estadoCivil: ['', Validators.required],
        telefone: ['', Validators.required],
        cpf: ['', Validators.required],
        email: ['', Validators.required],
      });

      this.formGroupLogin = this._formBuilder.group({
        email: ['', Validators.required],
        senha: ['', Validators.required],
        confirmarSenha: ['', Validators.required],
      });
    };

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  verificarFormGroupDadosPessoais() {
    this.formGroupDadosPessoais.markAllAsTouched();
  }

  verificarFormGroupLogin() {
    this.formGroupLogin.markAllAsTouched();
  }
}
