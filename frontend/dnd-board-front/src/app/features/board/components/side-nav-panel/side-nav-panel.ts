import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Board } from '../../shared/interfaces/board.interface';
import { Character } from '../../../characters/shared/interfaces/character.interface';
import { InitiativePanel } from '../initiative-panel/initiative-panel';
import { CharacterSheet } from '../character-sheet/character-sheet';
import { DiceRoller } from '../dice-roller/dice-roller';

type SideNavTab = 'initiative' | 'character' | 'dice';

@Component({
  selector: 'app-side-nav-panel',
  templateUrl: './side-nav-panel.html',
  imports: [InitiativePanel, CharacterSheet, DiceRoller, RouterLink, FaIconComponent],
})
export class SideNavPanel {
  board = input.required<Board>();
  playerCharacter = input<Character | null>(null);
  canAdvanceTurn = input<boolean>(false);
  canEditInitiative = input<boolean>(false);

  nextTurn = output<void>();
  orderChanged = output<number[]>();

  readonly activeTab = signal<SideNavTab>('initiative');
  readonly faArrowLeft = faArrowLeft;

  readonly tabs: { key: SideNavTab; label: string }[] = [
    { key: 'initiative', label: 'Iniciativa' },
    { key: 'character', label: 'Personaje' },
    { key: 'dice', label: 'Tiradas' },
  ];
}
