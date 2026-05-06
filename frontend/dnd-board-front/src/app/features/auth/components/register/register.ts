import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormField,
  email,
  form,
  maxLength,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';

import { RegisterRequest } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  registerModel = signal<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  errorMessage = input<string | undefined>();
  isLoading = input<boolean>(false);

  registerOutput = output<RegisterRequest>();

  registerForm = form(this.registerModel, (path) => {
    required(path.firstName, { message: 'El nombre es obligatorio' });
    maxLength(path.firstName, 255, { message: 'El nombre no puede tener más de 255 caracteres' });
    required(path.lastName, { message: 'El apellido es obligatorio' });
    maxLength(path.lastName, 255, { message: 'El apellido no puede tener más de 255 caracteres' });
    required(path.email, { message: 'El email es obligatorio' });
    email(path.email, { message: 'El email no es válido' });
    required(path.password, { message: 'La contraseña es obligatoria' });
    minLength(path.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });
    required(path.passwordConfirmation, {
      message: 'La confirmación de contraseña es obligatoria',
    });
    validate(path.passwordConfirmation, (value) => {
      if (value.value() !== this.registerModel().password) {
        return { kind: 'passwordsDoNotMatch', message: 'Las contraseñas no coinciden' };
      }
      return null;
    });
  });

  submit(): void {
    if (this.registerForm().valid()) {
      this.registerOutput.emit(this.registerModel());
    }
  }
}
