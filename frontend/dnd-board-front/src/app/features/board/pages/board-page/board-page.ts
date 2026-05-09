import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, interval } from 'rxjs';

import { AuthService } from '../../../auth/shared/services/auth.service';
import { Character } from '../../../characters/shared/interfaces/character.interface';
import { Board, GridCell } from '../../shared/interfaces/board.interface';
import { BoardService } from '../../shared/services/board.service';
import { BoardGrid } from '../../components/board-grid/board-grid';
import { GridConfigPanel } from '../../components/grid-config-panel/grid-config-panel';
import { InitiativePanel } from '../../components/initiative-panel/initiative-panel';

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 2;
const POLLING_INTERVAL_MS = 5000;

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.html',
  imports: [BoardGrid, GridConfigPanel, InitiativePanel],
})
export class BoardPage {
  readonly #route = inject(ActivatedRoute);
  readonly #auth = inject(AuthService);
  readonly #boardService = inject(BoardService);

  readonly #boardId = toSignal(
    this.#route.paramMap.pipe(map((params) => Number(params.get('id')))),
  );

  readonly boardResource = this.#boardService.getBoardResource(this.#boardId);

  readonly #lastKnownBoard = signal<Board | undefined>(undefined);
  readonly board = computed(() => this.boardResource.value() ?? this.#lastKnownBoard());

  readonly selectedCharacter = signal<Character | null>(null);
  readonly zoom = signal(1);
  readonly previewGrid = signal<{ cols: number; rows: number } | null>(null);

  constructor() {
    effect(() => {
      const board = this.boardResource.value();
      if (board !== undefined) this.#lastKnownBoard.set(board);
    });

    interval(POLLING_INTERVAL_MS)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#boardService.refreshBoard());
  }

  readonly isDm = computed(() => {
    const board = this.board();
    const user = this.#auth.currentUser()?.user;
    if (!board || !user) return false;
    return board.dm?.id === user.id || user.role === 'admin';
  });

  readonly reachableCells = computed<GridCell[]>(() => {
    const character = this.selectedCharacter();
    const board = this.board();
    if (!character || !board) return [];
    if (!this.#boardService.canMoveCharacter(board, character)) return [];
    return this.#boardService.getReachableCells(character, board);
  });

  readonly canAdvanceTurn = computed(() => {
    const board = this.board();
    const user = this.#auth.currentUser()?.user;
    if (!board || !user) return false;
    if (this.isDm()) return true;
    const currentEntry = board.initiativeOrder?.[board.currentTurnIndex];
    if (!currentEntry) return false;
    return (
      board.characters.find((character) => character.id === currentEntry.characterId)?.userId ===
      user.id
    );
  });

  readonly zoomPercent = computed(() => Math.round(this.zoom() * 100));

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    this.#applyZoom(delta);
  }

  zoomIn(): void {
    this.#applyZoom(ZOOM_STEP);
  }
  zoomOut(): void {
    this.#applyZoom(-ZOOM_STEP);
  }
  resetZoom(): void {
    this.zoom.set(1);
  }

  onTokenClicked(character: Character): void {
    const current = this.selectedCharacter();
    this.selectedCharacter.set(current?.id === character.id ? null : character);
  }

  onCellClicked(cell: GridCell): void {
    const character = this.selectedCharacter();
    const board = this.board();
    if (!character || !board) return;
    if (!this.#boardService.canMoveCharacter(board, character)) return;

    const isReachable = this.reachableCells().some(
      (reachableCell) => reachableCell.col === cell.col && reachableCell.row === cell.row,
    );
    if (!isReachable) {
      this.selectedCharacter.set(null);
      return;
    }

    this.#boardService
      .moveCharacter(board.id, { characterId: character.id, x: cell.col, y: cell.row })
      .subscribe(() => {
        this.selectedCharacter.set(null);
        this.#boardService.refreshBoard();
      });
  }

  onNextTurn(): void {
    const board = this.board();
    if (!board) return;
    this.#boardService.nextTurn(board.id).subscribe(() => this.#boardService.refreshBoard());
  }

  onOrderChanged(characterIds: number[]): void {
    const board = this.board();
    if (!board) return;
    this.#boardService
      .updateInitiativeOrder(board.id, characterIds)
      .subscribe(() => this.#boardService.refreshBoard());
  }

  onGridSaved(config: { cols: number; rows: number }): void {
    const board = this.board();
    if (!board) return;
    this.#boardService
      .updateGrid(board.id, { gridCols: config.cols, gridRows: config.rows })
      .subscribe(() => {
        this.previewGrid.set(null);
        this.#boardService.refreshBoard();
      });
  }

  #applyZoom(delta: number): void {
    const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, this.zoom() + delta));
    this.zoom.set(Math.round(next * 10) / 10);
  }
}
