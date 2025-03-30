import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email, this.emailValidador]);
  readonly senha = new FormControl('', [Validators.required]);

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  emailValidador(control: FormControl): ValidationErrors | null {
   const email = control.value;
   return email.endsWith('.com') ? null : { invalidEmail: true };
  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Por favor, digite um e-mail!';
    }

    if (this.email.hasError('email') || this.email.hasError('invalidEmail')) {
      return 'Por favor, digite um e-mail válido!';
    }

    return '';
  }

  getSenhaError(): string {
    return this.senha.hasError('required') ? 'Por favor, digite uma senha!' : '';
  }
}