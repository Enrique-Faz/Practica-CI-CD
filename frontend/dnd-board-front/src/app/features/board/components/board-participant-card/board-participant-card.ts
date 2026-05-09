import { Component, input, output } from '@angular/core';

import { Character } from '../../../characters/shared/interfaces/character.interface';

@Component({
  selector: 'app-board-participant-card',
  template: `
    <li
      class="flex items-center gap-3 bg-stone-800/70 border border-stone-700/50 rounded-xl px-4 py-2.5"
    >
      <img
        [src]="'/Clases/' + character().class + '.png'"
        [alt]="character().class"
        class="w-10 h-10 object-contain opacity-90"
        (error)="$any($event.target).style.display = 'none'"
      />
      <div class="flex flex-col flex-1">
        <span class="text-sm text-stone-200 font-bold">{{ character().name }}</span>
        <span class="text-xs text-stone-500 capitalize">{{ character().class }}</span>
      </div>
      @if (canRemove()) {
        <button
          (click)="remove()"
          title="Expulsar personaje"
          class="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-bold rounded-lg uppercase tracking-wide transition-colors shrink-0"
        >
          Expulsar
        </button>
      }
    </li>
  `,
})
export class BoardParticipantCard {
  character = input.required<Character>();
  canRemove = input<boolean>(false);
  onRemove = output<Character>();

  remove(): void {
    this.onRemove.emit(this.character());
  }
}
