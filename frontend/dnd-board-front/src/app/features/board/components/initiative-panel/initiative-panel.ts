import { Component, computed, input, output, signal } from '@angular/core';

import { Character } from '../../../characters/shared/interfaces/character.interface';
import { Board } from '../../shared/interfaces/board.interface';

@Component({
  selector: 'app-initiative-panel',
  templateUrl: './initiative-panel.html',
})
export class InitiativePanel {
  board = input.required<Board>();
  canAdvanceTurn = input<boolean>(false);
  canEditInitiative = input<boolean>(false);

  nextTurn = output<void>();
  orderChanged = output<number[]>(); // emite IDs de personajes en el nuevo orden

  editMode = signal(false);
  editList = signal<Character[]>([]);

  initiativeList = computed<Character[]>(() => {
    const b = this.board();
    if (!b.initiativeOrder?.length) return [];
    return b.initiativeOrder
      .map((entry) => b.characters.find((c) => c.id === entry.characterId))
      .filter((c): c is Character => !!c);
  });

  isCurrentTurn(index: number): boolean {
    return index === this.board().currentTurnIndex;
  }

  startCombat(): void {
    const ids = this.board().characters.map((c) => c.id);
    this.orderChanged.emit(ids);
  }

  startEdit(): void {
    this.editList.set([...this.initiativeList()]);
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }

  moveUp(index: number): void {
    if (index === 0) return;
    const list = [...this.editList()];
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    this.editList.set(list);
  }

  moveDown(index: number): void {
    const list = [...this.editList()];
    if (index === list.length - 1) return;
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    this.editList.set(list);
  }

  saveEdit(): void {
    this.orderChanged.emit(this.editList().map((c) => c.id));
    this.editMode.set(false);
  }

  onNextTurn(): void {
    this.nextTurn.emit();
  }
}
