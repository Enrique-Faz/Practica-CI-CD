import { Component, computed, input, output, signal } from '@angular/core';

import { Character } from '../../../characters/shared/interfaces/character.interface';
import { Board, GridCell } from '../../shared/interfaces/board.interface';
import { BoardToken } from '../board-token/board-token';

@Component({
  selector: 'app-board-grid',
  templateUrl: './board-grid.html',
  imports: [BoardToken],
})
export class BoardGrid {
  board = input.required<Board>();
  reachableCells = input<GridCell[]>([]);
  selectedCharacter = input<Character | null>(null);
  zoom = input<number>(1);
  previewGrid = input<{ cols: number; rows: number } | null>(null);

  tokenClicked = output<Character>();
  cellClicked = output<GridCell>();

  // Pan (arrastrar el mapa)
  panX = signal(0);
  panY = signal(0);
  isPanning = signal(false);
  wasDragging = false;
  #panStartX = 0;
  #panStartY = 0;
  #panOriginX = 0;
  #panOriginY = 0;

  // Tamaño fijo del tablero — la imagen siempre se muestra completa
  readonly boardWidth = 1280;
  readonly boardHeight = 960;

  cells = computed<GridCell[]>(() => {
    const cols = this.previewGrid()?.cols ?? this.board().gridCols ?? 20;
    const rows = this.previewGrid()?.rows ?? this.board().gridRows ?? 15;
    return Array.from({ length: rows * cols }, (_, index) => ({
      col: index % cols,
      row: Math.floor(index / cols),
    }));
  });

  // Lookups rápidos

  cellKey(cell: GridCell): string {
    return `${cell.col}-${cell.row}`;
  }

  isReachable(cell: GridCell): boolean {
    return this.reachableCells().some((c) => c.col === cell.col && c.row === cell.row);
  }

  isOccupied(cell: GridCell): boolean {
    return this.characterAt(cell) !== null;
  }

  characterAt(cell: GridCell): Character | null {
    return (
      this.board().characters.find(
        (c) => c.position?.x === cell.col && c.position?.y === cell.row,
      ) ?? null
    );
  }

  isSelected(character: Character): boolean {
    return this.selectedCharacter()?.id === character.id;
  }

  isCurrentTurn(character: Character): boolean {
    const board = this.board();
    if (!board.initiativeOrder?.length) return false;
    const entry = board.initiativeOrder[board.currentTurnIndex];
    return entry?.characterId === character.id;
  }

  hasActiveInitiative(): boolean {
    const order = this.board().initiativeOrder;
    return !!order && order.length > 0;
  }

  // Eventos

  onTokenClick(character: Character, event: Event): void {
    event.stopPropagation();
    if (this.wasDragging) return;
    this.tokenClicked.emit(character);
  }

  onCellClick(cell: GridCell): void {
    if (this.wasDragging) return;
    this.cellClicked.emit(cell);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }

  onPanStart(event: MouseEvent): void {
    if (event.button !== 0) return;
    this.isPanning.set(true);
    this.wasDragging = false;
    this.#panStartX = event.clientX;
    this.#panStartY = event.clientY;
    this.#panOriginX = this.panX();
    this.#panOriginY = this.panY();
  }

  onPanMove(event: MouseEvent): void {
    if (!this.isPanning()) return;
    const deltaX = event.clientX - this.#panStartX;
    const deltaY = event.clientY - this.#panStartY;
    // Si se movió más de 3px, es un drag real
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      this.wasDragging = true;
    }
    this.panX.set(this.#panOriginX + deltaX);
    this.panY.set(this.#panOriginY + deltaY);
  }

  onPanEnd(): void {
    this.isPanning.set(false);
  }
}
