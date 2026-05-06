import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, maxLength } from '@angular/forms/signals';

import { ModalService } from '../../../../shared/services/modal.service';
import { BoardService, CreateBoardRequest } from '../../shared/services/board.service';

@Component({
  selector: 'app-create-board-modal',
  imports: [FormField],
  templateUrl: './create-board-modal.html',
})
export class CreateBoardModal {
  readonly #modalService = inject(ModalService);
  readonly #boardService = inject(BoardService);

  isSaving = signal(false);

  boardModel = signal<CreateBoardRequest>({
    name: '',
    backgroundImage: 'forest.jpg',
  });

  boardForm = form(this.boardModel, (path) => {
    required(path.name, { message: 'El nombre es obligatorio' });
    maxLength(path.name, 255, { message: 'El nombre no puede tener más de 255 caracteres' });
    required(path.backgroundImage, { message: 'El fondo es obligatorio' });
  });

  backgrounds = [
    { value: 'forest.jpg', label: 'Bosque' },
    { value: 'dungeon.jpg', label: 'Mazmorra' },
    { value: 'tavern.jpg', label: 'Taberna' },
    { value: 'cave.jpg', label: 'Cueva' },
  ];

  submit(): void {
    if (this.boardForm().valid()) {
      this.isSaving.set(true);
      this.#boardService.createBoard(this.boardModel()).subscribe({
        next: () => {
          this.#boardService.refresh();
          this.#modalService.close(true);
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false),
      });
    }
  }

  dismiss(): void {
    this.#modalService.dismiss();
  }
}
