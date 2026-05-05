import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { Login } from '../../components/login/login';
import { LoginRequest } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-login-page',
  imports: [Login],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  readonly #authService = inject(AuthService);

  #loginSignal = signal<LoginRequest>({ email: '', password: '' });
  #twoFACodeSignal = signal<string>('');

  loginResource = this.#authService.login(this.#loginSignal);
  verify2faResource = this.#authService.verify2fa(this.#twoFACodeSignal);

  isLoading = this.#authService.isSyncing;
  show2FA = this.#authService.show2faInput;

  handleLogin(credentials: LoginRequest): void {
    this.#loginSignal.set(credentials);
  }

  get loginError(): string | undefined {
    const err = this.loginResource.error();
    if (!err) return undefined;
    return (err as unknown as HttpErrorResponse).error?.message ?? err.message;
  }

  handleVerify2FA(code: string): void {
    if (!code || code.length !== 6) return;
    this.#twoFACodeSignal.set(code);
  }

  cancel2FA(): void {
    this.#authService.reset2fa();
  }
}
