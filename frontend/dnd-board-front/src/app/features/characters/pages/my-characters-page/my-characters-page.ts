import { Component, computed, inject } from '@angular/core';

import { CharacterService } from '../../shared/services/character.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { CharacterFormModal } from '../../components/character-form-modal/character-form-modal';
import { Character } from '../../shared/interfaces/character.interface';

@Component({
  selector: 'app-my-characters-page',
  imports: [CharacterFormModal],
  templateUrl: './my-characters-page.html',
})
export class MyCharactersPage {
  readonly #characterService = inject(CharacterService);
  readonly #modalService = inject(ModalService);
  readonly #popupService = inject(PopupService);

  characters = computed(() => this.#characterService.characters.value() ?? []);
  isLoading = computed(() => this.#characterService.characters.isLoading());
  showCharacterModal = computed(() => this.#modalService.activeModal() === 'character-form');

  openCreateModal(): void {
    this.#modalService.open('character-form');
  }

  openEditModal(character: Character): void {
    this.#modalService.open('character-form', character);
  }

  confirmDelete(characterId: number, characterName: string): void {
    this.#popupService
      .ask({
        title: 'Eliminar personaje',
        message: `¿Estás seguro de que quieres eliminar "${characterName}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.#characterService.deleteCharacter(characterId).subscribe(() => {
            this.#characterService.refresh();
          });
        }
      });
  }
}
