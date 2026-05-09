import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../features/auth/shared/services/auth.service';
import { Board } from '../interfaces/board.interface';
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

  boards = httpResource<Board[]>(() => {
    this.#auth.currentUser()?.user.id;
    this.#refreshTrigger();
    return { url: `${API}/boards` };
  });

  canRemoveCharacter(board: Board, character: Character): boolean {
    const user = this.#auth.currentUser()?.user;
    if (!user) return false;
    return user.role === 'admin' || board.dm?.id === user.id || character.userId === user.id;
  }

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

  refresh(): void {
    this.#refreshTrigger.update((v) => v + 1);
  }
}
