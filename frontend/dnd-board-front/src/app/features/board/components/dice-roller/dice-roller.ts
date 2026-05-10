import { Component, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';

interface DiceRollEntry {
  id: number;
  die: number;
  result: number;
}

@Component({
  selector: 'app-dice-roller',
  templateUrl: './dice-roller.html',
  imports: [FaIconComponent],
})
export class DiceRoller {
  readonly diceOptions = [4, 6, 8, 10, 12, 20];
  readonly selectedDie = signal(20);
  readonly history = signal<DiceRollEntry[]>([]);
  readonly faDiceD20 = faDiceD20;

  #nextId = 1;

  roll(): void {
    const die = this.selectedDie();
    const result = Math.floor(Math.random() * die) + 1;
    this.history.update((previousRolls) => [{ id: this.#nextId++, die, result }, ...previousRolls]);
  }
}
