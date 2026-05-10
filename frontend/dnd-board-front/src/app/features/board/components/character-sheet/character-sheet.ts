import { Component, computed, input } from '@angular/core';

import { Character } from '../../../characters/shared/interfaces/character.interface';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.html',
})
export class CharacterSheet {
  character = input.required<Character>();

  classImage = computed(() => `/Clases/${this.character().class}.png`);

  stats = computed(() => {
    const s = this.character().stats;
    return [
      { label: 'FUE', value: s.strength },
      { label: 'DES', value: s.dexterity },
      { label: 'CON', value: s.constitution },
      { label: 'INT', value: s.intelligence },
      { label: 'SAB', value: s.wisdom },
      { label: 'CAR', value: s.charisma },
    ];
  });
}
