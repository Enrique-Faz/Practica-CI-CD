import { Component, computed, inject, input, output } from '@angular/core';

import { CardActions } from '../../../../shared/components/card-actions/card-actions';
import { Character } from '../../../characters/shared/interfaces/character.interface';
import { Board } from '../../shared/interfaces/board.interface';
import { BoardService } from '../../shared/services/board.service';
import { BoardParticipantCard } from '../board-participant-card/board-participant-card';

@Component({
  selector: 'app-board-card',
  imports: [CardActions, BoardParticipantCard],
  templateUrl: './board-card.html',
})
export class BoardCard {
  board = input.required<Board>();
  onDelete = output<Board>();
  onRemoveCharacter = output<{ boardId: number; character: Character }>();

  readonly #boardService = inject(BoardService);

  characterCount = computed(() => {
    const count = this.board().characters?.length ?? 0;
    return `${count} personaje${count !== 1 ? 's' : ''}`;
  });

  canRemoveCharacter(character: Character): boolean {
    return this.#boardService.canRemoveCharacter(this.board(), character);
  }

  delete(): void {
    this.onDelete.emit(this.board());
  }

  copyCode(): void {
    const code = this.board().joinCode;
    if (code) navigator.clipboard.writeText(code);
  }

  removeCharacter(character: Character): void {
    this.onRemoveCharacter.emit({ boardId: this.board().id, character });
  }
}
