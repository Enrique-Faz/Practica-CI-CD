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
import { SideNavPanel } from '../../components/side-nav-panel/side-nav-panel';
import { ZOOM_STEP, ZOOM_MIN, ZOOM_MAX, POLLING_INTERVAL_MS } from './board-page.constants';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.html',
  imports: [BoardGrid, GridConfigPanel, SideNavPanel, FaIconComponent],
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
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly previewGrid = signal<{ cols: number; rows: number } | null>(null);
  readonly sideNavOpen = signal(true);
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;

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

  readonly playerCharacter = computed(() => {
    const board = this.board();
    const userId = this.#auth.currentUser()?.user.id;
    if (!board || !userId) return null;
    return board.characters.find((c) => c.userId === userId) ?? null;
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
    const delta = -event.deltaY / 300;
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

  onPanChanged(pan: { x: number; y: number }): void {
    this.panX.set(pan.x);
    this.panY.set(pan.y);
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
    this.zoom.set(Math.round(next * 100) / 100);
  }
}
