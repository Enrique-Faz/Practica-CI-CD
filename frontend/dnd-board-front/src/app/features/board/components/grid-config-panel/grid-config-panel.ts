import { Component, OnInit, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Board } from '../../shared/interfaces/board.interface';

@Component({
  selector: 'app-grid-config-panel',
  imports: [FormsModule],
  template: `
    <div
      class="flex items-center gap-3 bg-stone-900/90 border border-amber-900/40 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm"
    >
      <span class="text-xs text-amber-400 font-bold uppercase tracking-wider shrink-0">Grid:</span>

      <div class="flex items-center gap-1.5">
        <label class="text-xs text-stone-400">Cols</label>
        <input
          type="number"
          [(ngModel)]="cols"
          min="5"
          max="100"
          class="w-16 bg-stone-800 border border-stone-700 text-stone-100 text-xs font-bold rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-amber-600"
        />
      </div>

      <span class="text-stone-600">×</span>

      <div class="flex items-center gap-1.5">
        <label class="text-xs text-stone-400">Filas</label>
        <input
          type="number"
          [(ngModel)]="rows"
          min="5"
          max="100"
          class="w-16 bg-stone-800 border border-stone-700 text-stone-100 text-xs font-bold rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-amber-600"
        />
      </div>

      <button
        (click)="save()"
        [disabled]="!isValid()"
        class="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-900 text-xs font-black rounded-lg uppercase tracking-wide transition-colors"
      >
        Guardar
      </button>
    </div>
  `,
})
export class GridConfigPanel implements OnInit {
  board = input.required<Board>();
  onGridSaved = output<{ cols: number; rows: number }>();
  previewChanged = output<{ cols: number; rows: number }>();

  cols = signal(20);
  rows = signal(15);

  constructor() {
    effect(() => {
      const cols = this.cols();
      const rows = this.rows();
      if (cols >= 5 && cols <= 100 && rows >= 5 && rows <= 100) {
        this.previewChanged.emit({ cols, rows });
      }
    });
  }

  ngOnInit(): void {
    const board = this.board();
    if (board.gridCols) this.cols.set(board.gridCols);
    if (board.gridRows) this.rows.set(board.gridRows);
  }

  isValid(): boolean {
    const c = this.cols();
    const r = this.rows();
    return c >= 5 && c <= 100 && r >= 5 && r <= 100;
  }

  save(): void {
    if (!this.isValid()) return;
    this.onGridSaved.emit({ cols: this.cols(), rows: this.rows() });
  }
}
