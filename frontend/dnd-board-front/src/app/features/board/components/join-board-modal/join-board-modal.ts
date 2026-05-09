import { Component, computed, inject, signal } from '@angular/core';

import { ModalService } from '../../../../shared/services/modal.service';
import { BoardService } from '../../shared/services/board.service';
import { JoinBoardRequest } from '../../shared/interfaces/join-board-request.interface';
import { CharacterService } from '../../../characters/shared/services/character.service';

@Component({
  selector: 'app-join-board-modal',
  imports: [],
  templateUrl: './join-board-modal.html',
})
export class JoinBoardModal {
  readonly #modalService = inject(ModalService);
  readonly #boardService = inject(BoardService);
  readonly #characterService = inject(CharacterService);

  isJoining = signal(false);
  joinCode = signal('');
  selectedCharacterId = signal<number | null>(null);

  characters = computed(() => this.#characterService.characters.value() ?? []);

  canSubmit = computed(
    () => this.joinCode().trim().length > 0 && this.selectedCharacterId() !== null,
  );

  onCodeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.joinCode.set(value.toUpperCase());
  }

  onCharacterSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCharacterId.set(value ? Number(value) : null);
  }

  submit(): void {
    const characterId = this.selectedCharacterId();
    if (!this.canSubmit() || characterId === null) return;

    const request: JoinBoardRequest = {
      joinCode: this.joinCode().trim(),
      characterId,
    };

    this.isJoining.set(true);
    this.#boardService.joinBoard(request).subscribe({
      next: () => {
        this.#boardService.refresh();
        this.#modalService.close(true);
        this.isJoining.set(false);
      },
      error: () => this.isJoining.set(false),
    });
  }

  dismiss(): void {
    this.#modalService.dismiss();
  }
}
