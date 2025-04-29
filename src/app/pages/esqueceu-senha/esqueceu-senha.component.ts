import { merge } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrl: './esqueceu-senha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  emailError = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.emailErrorMessage());
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
}
