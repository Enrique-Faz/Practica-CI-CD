import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../../features/auth/shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  templateUrl: './header.html',
})
export class Header {
  readonly #authService = inject(AuthService);

  currentUser = this.#authService.currentUser;
  isAdmin = this.#authService.isAdmin;
  isLoggedIn = this.#authService.isLoggedIn;
  readonly faDiceD20 = faDiceD20;

  logout(): void {
    this.#authService.logout();
  }
}
