import { Injectable, Signal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../features/auth/shared/services/auth.service';
import { Board, GridCell, MoveCharacterRequest, UpdateGridRequest } from '../interfaces/board.interface';
import { BoardMap } from '../types/board-map.enum';
import { JoinBoardRequest } from '../interfaces/join-board-request.interface';
import { Character } from '../../../characters/shared/interfaces/character.interface';

const API = environment.apiEndpoint;

export interface CreateBoardRequest {
  name: string;
  backgroundImage: BoardMap;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly #http = inject(HttpClient);
  readonly #auth = inject(AuthService);

  #refreshTrigger = signal(0);
  #boardRefreshTrigger = signal(0);

  boards = httpResource<Board[]>(() => {
    this.#auth.currentUser()?.user.id;
    this.#refreshTrigger();
    return { url: `${API}/boards` };
  });

  getBoardResource(boardId: Signal<number | undefined>) {
    return httpResource<Board>(() => {
      const id = boardId();
      if (!id) return undefined;
      this.#boardRefreshTrigger();
      return { url: `${API}/boards/${id}` };
    });
  }

  // ── Lógica de negocio ───────────────────────────────────────────────

  canRemoveCharacter(board: Board, character: Character): boolean {
    const user = this.#auth.currentUser()?.user;
    if (!user) return false;
    return user.role === 'admin' || board.dm?.id === user.id || character.userId === user.id;
  }

  canDeleteBoard(board: Board): boolean {
    const user = this.#auth.currentUser()?.user;
    if (!user) return false;
    return user.role === 'admin' || board.dm?.id === user.id;
  }

  canMoveCharacter(board: Board, character: Character): boolean {
    const user = this.#auth.currentUser()?.user;
    if (!user) return false;
    const isDm = board.dm?.id === user.id;
    if (isDm) return true;
    if (character.userId !== user.id) return false;
    if (!board.initiativeOrder || board.initiativeOrder.length === 0) return true;
    const currentEntry = board.initiativeOrder[board.currentTurnIndex];
    return currentEntry?.characterId === character.id;
  }

  getReachableCells(character: Character, board: Board): GridCell[] {
    const position = character.position;
    if (!position || !board.gridCols || !board.gridRows) return [];

    const maxCells = Math.floor(character.speed / 5);
    const cells: GridCell[] = [];

    for (let col = 0; col < board.gridCols; col++) {
      for (let row = 0; row < board.gridRows; row++) {
        const dist = Math.max(Math.abs(col - position.x), Math.abs(row - position.y));
        if (dist > 0 && dist <= maxCells) {
          cells.push({ col, row });
        }
      }
    }
    return cells;
  }

  // ── HTTP mutations ──────────────────────────────────────────────────

  createBoard(data: CreateBoardRequest) {
    return this.#http.post<{ data: Board }>(`${API}/boards`, data);
  }

  joinBoard(data: JoinBoardRequest) {
    return this.#http.post<{ data: Board }>(`${API}/boards/join`, data);
  }

  deleteBoard(id: number) {
    return this.#http.delete(`${API}/boards/${id}`);
  }

  removeCharacter(boardId: number, characterId: number) {
    return this.#http.delete(`${API}/boards/${boardId}/characters/${characterId}`);
  }

  updateGrid(boardId: number, data: UpdateGridRequest) {
    return this.#http.put<{ data: Board }>(`${API}/boards/${boardId}`, data);
  }

  moveCharacter(boardId: number, data: MoveCharacterRequest) {
    return this.#http.post<{ message: string }>(`${API}/boards/${boardId}/move`, data);
  }

  nextTurn(boardId: number) {
    return this.#http.post<Board>(`${API}/boards/${boardId}/next-turn`, {});
  }

  refresh(): void {
    this.#refreshTrigger.update((v) => v + 1);
  }

  refreshBoard(): void {
    this.#boardRefreshTrigger.update((v) => v + 1);
  }
}

  refresh(): void {
    this.#refreshTrigger.update((v) => v + 1);
  }
}
