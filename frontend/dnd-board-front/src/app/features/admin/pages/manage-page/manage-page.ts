import { Component, effect, inject, signal } from '@angular/core';

import { AdminService } from '../../shared/services/admin.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { UsersTable } from '../../components/users-table/users-table';
import { BoardsTable } from '../../components/boards-table/boards-table';

@Component({
  selector: 'app-manage-page',
  imports: [UsersTable, BoardsTable],
  templateUrl: './manage-page.html',
})
export class ManagePage {
  readonly #adminService = inject(AdminService);
  readonly #popupService = inject(PopupService);

  readonly #userDeleteId = signal<number | undefined>(undefined);
  readonly #boardDeleteId = signal<number | undefined>(undefined);

  readonly usersResource = this.#adminService.loadUsers();
  readonly boardsResource = this.#adminService.loadBoards();
  readonly userDeleteResource = this.#adminService.deleteUser(this.#userDeleteId);
  readonly boardDeleteResource = this.#adminService.deleteBoard(this.#boardDeleteId);

  readonly #userDeleteEffect = effect(() => {
    if (this.userDeleteResource.hasValue()) {
      this.usersResource.reload();
      this.#userDeleteId.set(undefined);
    }
  });

  readonly #boardDeleteEffect = effect(() => {
    if (this.boardDeleteResource.hasValue()) {
      this.boardsResource.reload();
      this.#boardDeleteId.set(undefined);
    }
  });

  handleDeleteUser(event: { id: number; name: string }): void {
    this.#popupService
      .ask({
        title: 'Eliminar usuario',
        message: `¿Eliminar al usuario "${event.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) this.#userDeleteId.set(event.id);
      });
  }

  handleDeleteBoard(event: { id: number; name: string }): void {
    this.#popupService
      .ask({
        title: 'Eliminar partida',
        message: `¿Eliminar la partida "${event.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) this.#boardDeleteId.set(event.id);
      });
  }
}
