import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
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
  private readonly URL = `${environment.API_URL}/auth`;
  readonly email = new FormControl('', [Validators.required, this.emailValidators]);
  readonly password = new FormControl('', [Validators.required]);

  constructor(private httpClient: HttpClient, private router: Router) {}

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
    this.httpClient.post(this.URL, body).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.successMessage();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage();
      }
    );
  }

  private emailValidators(control: FormControl): ValidationErrors | null {
    const email = control.value;

    if (!email.includes('@') || (!email.endsWith('.com') && !email.endsWith('.br'))) {
      return { invalidEmail: true };
    }

    return null;
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

  private successMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Login realizado com sucesso!',
      toast: true,
      position: 'top-end',
      background: '#dff0d8', 
      color: '#000000', 
      width: '30%',
      showConfirmButton: false,
      timer: 4750,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }
  
  private errorMessage() {
    Swal.fire({
      icon: 'error',
      title: 'Credenciais Inválidas!',
      text: 'Verifique seu e-mail ou senha e tente novamente.',
      toast: true,
      position: 'top-end',
      background: '#f8d7da', 
      color: '#000000', 
      width: '30%', 
      showConfirmButton: false,
      timer: 4750,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }  
}