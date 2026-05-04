import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  readonly #authService = inject(AuthService);

  user = computed(() => this.#authService.currentUser());
  isAdmin = computed(() => this.user()?.user.role === 'admin');

  logout(): void {
    this.#authService.logout();
  }
}
