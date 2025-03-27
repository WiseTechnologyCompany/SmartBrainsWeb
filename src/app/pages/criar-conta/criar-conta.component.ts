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
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    constructor(private _formBuilder: FormBuilder) {
      this.firstFormGroup = this._formBuilder.group({
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        dataNascimento: ['', Validators.required],
        genero: ['', Validators.required],
        estadoCivil: ['', Validators.required],
        telefone: ['', Validators.required],
        cpf: ['', Validators.required],
        rg: ['', Validators.required],
      });

      this.secondFormGroup = this._formBuilder.group({
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required],
        cep: ['', Validators.required],
        complemento: ['', Validators.required],
        pontoReferencia: ['', Validators.required],
      });

      this.thirdFormGroup = this._formBuilder.group({
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

  verificarPrimeiroForms() {
    this.firstFormGroup.markAllAsTouched();
  }

  verificarSegundoForms() {
    this.secondFormGroup.markAllAsTouched();
  }

  verificarTerceiroForms() {
    this.thirdFormGroup.markAllAsTouched();
  }
}
