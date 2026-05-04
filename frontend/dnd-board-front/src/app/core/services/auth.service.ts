import { HttpClient, HttpResourceRef, httpResource } from '@angular/common/http';
import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  LoggedUser,
  RegisterRequest,
} from '../../features/auth/shared/interfaces/user.interface';

const API = environment.apiEndpoint;
const STORAGE_KEY = 'auth_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #router = inject(Router);
  readonly #http = inject(HttpClient);

  currentUser = signal<LoggedUser | undefined>(this.#getStoredSession());
  isSyncing = signal<boolean>(false);
  show2faInput = signal<boolean>(false);
  #tempUserId = signal<number | null>(null);

  login(loginSignal: WritableSignal<LoginRequest>): HttpResourceRef<AuthResponse | undefined> {
    const resource = httpResource<AuthResponse | undefined>(() => {
      const credentials = loginSignal();
      if (!credentials.email || !credentials.password) return undefined;
      return { url: `${API}/login`, method: 'POST', body: credentials };
    });

    effect(() => {
      this.isSyncing.set(resource.isLoading());

      if (resource.hasValue()) {
        const res = resource.value() as AuthResponse;

        if (res.require_2fa && res.temp_user_id) {
          this.#tempUserId.set(res.temp_user_id);
          this.show2faInput.set(true);
        } else if (res.token) {
          this.#updateSession({ token: res.token, user: res.user });
          this.#router.navigate(['/board']);
        }
      }
    });

    return resource;
  }

  verify2fa(codeSignal: WritableSignal<string>): HttpResourceRef<AuthResponse | undefined> {
    const resource = httpResource<AuthResponse | undefined>(() => {
      const code = codeSignal();
      const userId = this.#tempUserId();
      if (!code || !userId) return undefined;
      return {
        url: `${API}/verify-2fa`,
        method: 'POST',
        body: { userId, code },
      };
    });

    effect(() => {
      this.isSyncing.set(resource.isLoading());
      if (resource.hasValue()) {
        const res = resource.value() as AuthResponse;
        this.#updateSession({ token: res.token, user: res.user });
        this.show2faInput.set(false);
        this.#tempUserId.set(null);
        this.#router.navigate(['/board']);
      }
    });

    return resource;
  }

  register(
    registerSignal: WritableSignal<RegisterRequest>,
  ): HttpResourceRef<AuthResponse | undefined> {
    const resource = httpResource<AuthResponse | undefined>(() => {
      const data = registerSignal();
      if (!data.email || !data.password) return undefined;
      return { url: `${API}/register`, method: 'POST', body: data };
    });

    effect(() => {
      this.isSyncing.set(resource.isLoading());
      if (resource.hasValue()) {
        const res = resource.value() as AuthResponse;
        this.#updateSession({ token: res.token, user: res.user });
        this.#router.navigate(['/board']);
      }
    });

    return resource;
  }

  logout(): void {
    this.#http.post(`${API}/logout`, {}).subscribe({
      complete: () => this.#clearSession(),
    });
  }

  reset2fa(): void {
    this.show2faInput.set(false);
    this.#tempUserId.set(null);
  }

  #updateSession(session: LoggedUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.currentUser.set(session);
  }

  #clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser.set(undefined);
    this.#router.navigate(['/auth/login']);
  }

  #getStoredSession(): LoggedUser | undefined {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return undefined;
    try {
      return JSON.parse(data) as LoggedUser;
    } catch {
      return undefined;
    }
  }
}
