import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EsqueceuSenhaService } from './esqueceu-senha.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrl: './esqueceu-senha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class EsqueceuSenhaComponent {
  readonly email = new FormControl('', [
    Validators.required,
    GlobalValidators.emailValidator,
  ]);

  constructor(private readonly esqueceuSenhaService: EsqueceuSenhaService) {}

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Por favor, digite um e-mail!';
    }

    if (this.email.hasError('invalidEmail')) {
      return 'Por favor, digite um e-mail válido!';
    }

    return '';
  }

  verificarFormGroup() {
    this.email.markAllAsTouched();

    this.verificarEmailExistente();
  }

  async verificarEmailExistente() {
    const email = this.email.value;

    if (email && email.length > 0) {
      const existe = await this.esqueceuSenhaService.checkEmail(email);

      if (existe) {
        sessionStorage.setItem('email', email);
        await this.esqueceuSenhaService.sendEmail({ email });
      } else {
        Swal.fire({
          title: 'Atenção!',
          text: 'O e-mail informado não existe em nosso sistema! Por favor, verifique e tente novamente.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#76a7b9',
        });
      }
    }
  }
}
