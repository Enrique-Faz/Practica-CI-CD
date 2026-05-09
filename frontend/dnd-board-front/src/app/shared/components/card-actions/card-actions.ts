import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-actions',
  imports: [RouterLink],
  template: `
    <div [class]="horizontal() ? 'flex flex-row gap-3' : 'flex flex-col gap-3 w-36 shrink-0'">
      @if (primaryLink()) {
        <a
          [routerLink]="primaryLink()"
          class="w-full px-4 py-3 text-center bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 text-sm font-bold rounded-lg uppercase tracking-wide transition-colors"
        >
          {{ primaryLabel() }}
        </a>
      } @else {
        <button
          (click)="onPrimary.emit()"
          class="w-full px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 text-sm font-bold rounded-lg uppercase tracking-wide transition-colors"
        >
          {{ primaryLabel() }}
        </button>
      }
      @if (showDelete()) {
        <button
          (click)="onDelete.emit()"
          class="w-full px-4 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-bold rounded-lg uppercase tracking-wide transition-colors"
        >
          {{ deleteLabel() }}
        </button>
      }
    </div>
  `,
})
export class CardActions {
  primaryLabel = input<string>('Editar');
  primaryLink = input<unknown[] | null>(null);
  deleteLabel = input<string>('Borrar');
  horizontal = input<boolean>(false);
  showDelete = input<boolean>(true);
  onPrimary = output<void>();
  onDelete = output<void>();
}
