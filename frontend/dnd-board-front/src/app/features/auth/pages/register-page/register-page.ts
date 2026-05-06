import { Component, ViewChild, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../shared/services/auth.service';
import { HasUnsavedChanges } from '../../../../shared/interfaces/has-unsaved-changes.interface';
import { Register } from '../../components/register/register';
import { RegisterRequest } from '../../shared/interfaces/user.interface';
import { extractApiError } from '../../../../shared/utils/extract-api.error.utils';

@Component({
  selector: 'app-register-page',
  imports: [Register],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage implements HasUnsavedChanges {
  readonly #authService = inject(AuthService);

  @ViewChild(Register) formComponent!: Register;

  #registerSignal = signal<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  registerResource = this.#authService.register(this.#registerSignal);

  isLoading = this.#authService.isSyncing;
  registerError = computed(() => extractApiError(this.registerResource.error()));

  hasUnsavedChanges(): boolean {
    return this.formComponent?.registerForm().dirty() ?? false;
  }

  handleRegister(credentials: RegisterRequest): void {
    this.#registerSignal.set(credentials);
  }
}
