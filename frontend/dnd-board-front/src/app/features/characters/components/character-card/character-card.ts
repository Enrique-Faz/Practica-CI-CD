import { Component, computed, input, output } from '@angular/core';

import { Character } from '../../shared/interfaces/character.interface';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.html',
})
export class CharacterCard {
  character = input.required<Character>();

  onEdit = output<Character>();
  onDelete = output<Character>();

  stats = computed(() => {
    const stats = this.character().stats;
    return [
      { label: 'FUE', value: stats.strength },
      { label: 'DES', value: stats.dexterity },
      { label: 'CON', value: stats.constitution },
      { label: 'INT', value: stats.intelligence },
      { label: 'SAB', value: stats.wisdom },
      { label: 'CAR', value: stats.charisma },
    ];
  });

  edit(): void {
    this.onEdit.emit(this.character());
  }

  delete(): void {
    this.onDelete.emit(this.character());
  }
}
