import { Component, computed, input } from '@angular/core';

import { Character } from '../../../characters/shared/interfaces/character.interface';

@Component({
  selector: 'app-board-token',
  template: `
    <div
      class="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none"
      [class.ring-2]="isSelected() || isCurrentTurn()"
      [class.ring-amber-400]="isCurrentTurn()"
      [class.ring-white]="isSelected() && !isCurrentTurn()"
      [class.scale-110]="isSelected()"
      [title]="character().name"
    >
      <img
        [src]="classImage()"
        [alt]="character().class"
        class="w-full h-full object-cover rounded-full"
        (error)="$any($event.target).style.display = 'none'"
      />
      <!-- Indicador de turno -->
      @if (isCurrentTurn()) {
        <span
          class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-stone-900 animate-pulse"
        ></span>
      }
    </div>
  `,
})
export class BoardToken {
  character = input.required<Character>();
  isSelected = input<boolean>(false);
  isCurrentTurn = input<boolean>(false);
  hasInitiative = input<boolean>(false);

  classImage = computed(() => `/Clases/${this.character().class}.png`);
}
