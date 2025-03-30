import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

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
  formSubmitted = false;
  private readonly URL = 'http://localhost:8080/SmartBrainsAPI/v1/auth';
  readonly email = new FormControl('', [Validators.required, Validators.email, this.emailValidador]);
  readonly password = new FormControl('', [Validators.required]);

  constructor(private httpClient: HttpClient) {}

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  sendData() {
    this.formSubmitted = true;

    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    const body = {
      email: this.email.value,
      password: this.password.value,
    };

    this.httpClient.post(this.URL, body).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.successMessage();
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage();
      }
    )
  }

  emailValidador(control: FormControl): ValidationErrors | null {
   const email = control.value;
   return email.endsWith('.com') || email.endsWith('.br') ? null : { invalidEmail: true };
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
    return this.password.hasError('required') ? 'Por favor, digite uma senha!' : '';
  }

  successMessage() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Login realizado com sucesso!",
    });
  }

  errorMessage() {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Email ou senha incorretos!",
      });
  }
}