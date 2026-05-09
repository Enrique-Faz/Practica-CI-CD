import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Board } from '../../shared/interfaces/board.interface';

@Component({
  selector: 'app-board-card',
  imports: [RouterLink],
  templateUrl: './board-card.html',
})
export class BoardCard {
  board = input.required<Board>();
  onDelete = output<Board>();

  characterCount = computed(() => {
    const count = this.board().characters?.length ?? 0;
    return `${count} personaje${count !== 1 ? 's' : ''}`;
  });

  delete(): void {
    this.onDelete.emit(this.board());
  }

  copyCode(): void {
    const code = this.board().joinCode;
    if (code) navigator.clipboard.writeText(code);
  }
}
