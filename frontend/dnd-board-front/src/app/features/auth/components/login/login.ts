import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';

import { LoginRequest } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  loginModel = signal<LoginRequest>({ email: '', password: '' });

  errorMessage = input<string | undefined>();
  isLoading = input<boolean>(false);

  loginOutput = output<LoginRequest>();

  loginForm = form(this.loginModel, (path) => {
    required(path.email, { message: 'El email es obligatorio' });
    email(path.email, { message: 'El email no es válido' });
    required(path.password, { message: 'La contraseña es obligatoria' });
    minLength(path.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });
  });

  submit(): void {
    if (this.loginForm().valid()) {
      this.loginOutput.emit(this.loginModel());
    }
  }
}
