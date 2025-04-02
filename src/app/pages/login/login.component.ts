import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/Environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorMessages } from '../../../utils/messages/ErrorMessages';
import { SuccessMessages } from '../../../utils/messages/SuccessMessages';
import { EmailValidator } from '../../../utils/validators/EmailValidator';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  hide = true;
  private readonly URL = `${environment.API_URL}/auth`;
  readonly password = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, EmailValidator.emailValidator]);

  constructor(private readonly httpClient: HttpClient, private readonly router: Router) {}

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  sendData() {
    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    const body = this.createBody();
    this.createRequest(body);
  }

  private createBody() {
    return {
      email: this.email.value,
      password: this.password.value,
    };
  }

  private createRequest(body: any) {
    this.httpClient.post<{ access_token: string }>(this.URL, body).subscribe({
      next: (response) => { 
        
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token); 
        }

        SuccessMessages.loginSuccessMessage();
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        ErrorMessages.loginErrorMessage();
      }
    });
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