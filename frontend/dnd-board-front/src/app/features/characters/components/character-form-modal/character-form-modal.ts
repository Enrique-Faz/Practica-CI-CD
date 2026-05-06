import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormField, form, required, maxLength } from '@angular/forms/signals';

import { ModalService } from '../../../../shared/services/modal.service';
import { CharacterService, CreateCharacterRequest } from '../../shared/services/character.service';
import { Character } from '../../shared/interfaces/character.interface';

@Component({
  selector: 'app-character-form-modal',
  imports: [FormField],
  templateUrl: './character-form-modal.html',
})
export class CharacterFormModal implements OnInit {
  readonly #modalService = inject(ModalService);
  readonly #characterService = inject(CharacterService);

  isSaving = signal(false);
  isEditing = computed(() => this.#modalService.modalData() !== null);
  editingCharacter = computed(() => this.#modalService.modalData() as Character | null);

  characterModel = signal<CreateCharacterRequest>({
    name: '',
    hp: 10,
    speed: 30,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });

  characterForm = form(this.characterModel, (path) => {
    required(path.name, { message: 'El nombre es obligatorio' });
    maxLength(path.name, 255, { message: 'Máximo 255 caracteres' });
  });

  ngOnInit(): void {
    const data = this.editingCharacter();
    if (data) {
      this.characterModel.set({
        name: data.name,
        hp: data.hp,
        speed: data.speed,
        strength: data.stats.strength,
        dexterity: data.stats.dexterity,
        constitution: data.stats.constitution,
        intelligence: data.stats.intelligence,
        wisdom: data.stats.wisdom,
        charisma: data.stats.charisma,
      });
    }
  }

  submit(): void {
    if (this.characterForm().valid()) {
      this.isSaving.set(true);
      const data = this.characterModel();
      const editChar = this.editingCharacter();

      const request$ = editChar
        ? this.#characterService.updateCharacter(editChar.id, data)
        : this.#characterService.createCharacter(data);

      request$.subscribe({
        next: () => {
          this.#characterService.refresh();
          this.#modalService.close(true);
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false),
      });
    }
  }

  dismiss(): void {
    this.#modalService.dismiss();
  }
}
