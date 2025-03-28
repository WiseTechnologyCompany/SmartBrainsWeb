import { merge } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly senha = new FormControl('', [Validators.required]);

  emailError = signal('');
  senhaError = signal('');

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.emailErrorMessage());

    merge(this.senha.statusChanges, this.senha.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.senhaErrorMessage());
  }

  emailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailError.set('Por favor, digite um e-mail!');
    }
    else if (this.email.hasError('email')) {
      this.emailError.set('Por favor, digite um e-mail válido!');
    }
    else {
      this.emailError.set('');
    }
  }

  senhaErrorMessage() {
    if (this.senha.hasError('required')) {
      this.senhaError.set('Por favor, digite uma senha!');
    } else {
      this.senhaError.set('');
    }
  }
}
