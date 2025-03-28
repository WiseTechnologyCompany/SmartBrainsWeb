import { merge } from 'rxjs';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    MatSelectModule
  ],
  providers: [
    provideNgxMask()
  ],
})
export class CriarContaComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  isEditable = true;
  hide = signal(true);
  emailError = signal('');

  formGroupDadosPessoais: FormGroup;
  formGroupLogin: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.emailErrorMessage());

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
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    });
  }

  emailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailError.set('Por favor, digite um e-mail!');
    } else if (this.email.hasError('email')) {
      this.emailError.set('Por favor, digite um e-mail válido!');
    } else {
      this.emailError.set('');
    }
  }

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
