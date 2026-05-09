import { Component, computed, inject } from '@angular/core';

import { BoardService } from '../../shared/services/board.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { CreateBoardModal } from '../../components/create-board-modal/create-board-modal';
import { JoinBoardModal } from '../../components/join-board-modal/join-board-modal';
import { BoardCard } from '../../components/board-card/board-card';

@Component({
  selector: 'app-my-boards-page',
  imports: [CreateBoardModal, JoinBoardModal, BoardCard],
  templateUrl: './my-boards-page.html',
})
export class MyBoardsPage {
  readonly #boardService = inject(BoardService);
  readonly #modalService = inject(ModalService);
  readonly #popupService = inject(PopupService);

  boards = computed(() => this.#boardService.boards.value() ?? []);
  isLoading = computed(() => this.#boardService.boards.isLoading());
  showCreateModal = computed(() => this.#modalService.activeModal() === 'create-board');
  showJoinModal = computed(() => this.#modalService.activeModal() === 'join-board');

  openCreateModal(): void {
    this.#modalService.open('create-board');
  }

  openJoinModal(): void {
    this.#modalService.open('join-board');
  }

  confirmDelete(boardId: number, boardName: string): void {
    this.#popupService
      .ask({
        title: 'Eliminar partida',
        message: `¿Estás seguro de que quieres eliminar "${boardName}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.#boardService.deleteBoard(boardId).subscribe(() => {
            this.#boardService.refresh();
          });
        }
      });
  }
}
