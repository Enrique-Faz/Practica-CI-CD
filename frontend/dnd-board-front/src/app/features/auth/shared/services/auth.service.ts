import { HttpClient, HttpResourceRef, httpResource } from '@angular/common/http';
import { Injectable, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  LoggedUser,
  RegisterRequest,
  User,
} from '../interfaces/user.interface';

const API = environment.apiEndpoint;
const STORAGE_KEY = 'auth_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #router = inject(Router);
  readonly #http = inject(HttpClient);
  #currentUserSignal = signal<LoggedUser | undefined>(this.#getStoredSession());
  #tempUserId = signal<number | null>(null);
  currentUser = computed(() => this.#currentUserSignal());
  isSyncing = signal<boolean>(false);
  show2faInput = signal<boolean>(false);
  isLoggedIn = computed(() => Boolean(this.currentUser()));
  isAdmin = computed(() => this.currentUser()?.user.role === 'admin');

  constructor() {
    this.#handleSocialCallback();
  }

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
        } else if (res.data?.token) {
          this.#updateSession({
            token: res.data.token,
            user: res.data.user,
            expiresAt: res.expiresAt,
          });
          this.#router.navigate(['/dashboard']);
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
        if (res.data?.token) {
          this.#updateSession({
            token: res.data.token,
            user: res.data.user,
            expiresAt: res.expiresAt,
          });
          this.show2faInput.set(false);
          this.#tempUserId.set(null);
          this.#router.navigate(['/dashboard']);
        }
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
        if (res.data?.token) {
          this.#updateSession({
            token: res.data.token,
            user: res.data.user,
            expiresAt: res.expiresAt,
          });
          this.#router.navigate(['/dashboard']);
        }
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

  #handleSocialCallback(): void {
    const params = new URLSearchParams(window.location.search);

    const require2fa = params.get('require_2fa');
    const tempUserId = params.get('temp_user_id');
    if (require2fa === 'true' && tempUserId) {
      this.#tempUserId.set(Number(tempUserId));
      this.show2faInput.set(true);
      this.#router.navigate(['/auth/login'], { replaceUrl: true });
      return;
    }

    const sessionRaw = params.get('session');
    if (!sessionRaw) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionRaw));
      const session: LoggedUser = {
        token: parsed.data.token,
        user: parsed.data.user,
        expiresAt: parsed.expiresAt,
      };
      this.#updateSession(session);
      this.#router.navigate(['/dashboard'], { replaceUrl: true });
    } catch {
      // ignore malformed session
    }
  }

  refreshCurrentUser(): void {
    const session = this.#currentUserSignal();
    if (!session) return;
    this.#http.get<{ data: { user: User } }>(`${API}/user`).subscribe({
      next: (res) => {
        const updated: LoggedUser = { ...session, user: res.data.user };
        this.#updateSession(updated);
      },
    });
  }

  #updateSession(session: LoggedUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.#currentUserSignal.set(session);
  }

  #clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.#currentUserSignal.set(undefined);
    this.#router.navigate(['/auth/login']);
  }

  #getStoredSession(): LoggedUser | undefined {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return undefined;
    try {
      const session = JSON.parse(data) as LoggedUser;
      if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        return undefined;
      }
      return session;
    } catch {
      return undefined;
    }
  }
}
