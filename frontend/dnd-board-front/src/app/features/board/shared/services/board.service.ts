import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Board } from '../interfaces/board.interface';
import { BoardMap } from '../types/board-map.enum';
import { JoinBoardRequest } from '../interfaces/join-board-request.interface';

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

  #refreshTrigger = signal(0);

  boards = httpResource<Board[]>(() => {
    this.#refreshTrigger();
    return { url: `${API}/boards` };
  });

  createBoard(data: CreateBoardRequest) {
    return this.#http.post<{ data: Board }>(`${API}/boards`, data);
  }

  joinBoard(data: JoinBoardRequest) {
    return this.#http.post<{ data: Board }>(`${API}/boards/join`, data);
  }

  deleteBoard(id: number) {
    return this.#http.delete(`${API}/boards/${id}`);
  }

  refresh(): void {
    this.#refreshTrigger.update((v) => v + 1);
  }
}
