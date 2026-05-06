import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../features/auth/shared/services/auth.service';
import { BoardService } from '../../../features/board/shared/services/board.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  readonly #authService = inject(AuthService);
  readonly #boardService = inject(BoardService);
  readonly #router = inject(Router);

  currentUser = this.#authService.currentUser;
  isAdmin = this.#authService.isAdmin;
  isLoggedIn = this.#authService.isLoggedIn;

  activeBoardName = computed(() => {
    const url = this.#router.url;
    const match = url?.match(/^\/board\/(\d+)/);
    if (!match) return null;
    const boardId = Number(match[1]);
    const boards = this.#boardService.boards.value();
    const board = boards?.find((b) => b.id === boardId);
    return board?.name ?? null;
  });

  logout(): void {
    this.#authService.logout();
  }
}
