import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalValidators } from '../../utils/validators/GlobalValidators';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class LoginComponent {
  hide = true;
  readonly password = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, GlobalValidators.emailValidator]);

  constructor(private readonly loginService: LoginService, private readonly router: Router) {}

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  async sendData() {
    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    const body = this.createBody();
    await this.loginService.createRequest(body);
  }

  private createBody() {
    return {
      email: this.email.value,
      password: this.password.value,
    };
  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Por favor, digite um e-mail!';
    }

    if (this.email.hasError('invalidEmail')) {
      return 'Por favor, digite um e-mail válido!';
    }

    return '';
  }

  getSenhaError(): string {
    return this.password.hasError('required') ? 'Por favor, digite uma senha!' : '';
  }
}