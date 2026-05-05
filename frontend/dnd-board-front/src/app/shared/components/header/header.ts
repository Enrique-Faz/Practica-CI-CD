import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  readonly #authService = inject(AuthService);

  currentUser = this.#authService.currentUser;
  isAdmin = this.#authService.isAdmin;
  isLoggedIn = this.#authService.isLoggedIn;

  logout(): void {
    this.#authService.logout();
  }
}
