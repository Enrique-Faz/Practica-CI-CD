import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Character } from '../interfaces/character.interface';
import { CharacterClass } from '../types/character-class.enum';

const API = environment.apiEndpoint;

export interface CreateCharacterRequest {
  name: string;
  class: CharacterClass;
  hp: number;
  speed: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  readonly #http = inject(HttpClient);

  #refreshTrigger = signal(0);

  characters = httpResource<Character[]>(() => {
    this.#refreshTrigger();
    return { url: `${API}/characters` };
  });

  createCharacter(data: CreateCharacterRequest) {
    return this.#http.post<{ data: Character }>(`${API}/characters`, data);
  }

  updateCharacter(id: number, data: CreateCharacterRequest) {
    return this.#http.put<{ data: Character }>(`${API}/characters/${id}`, data);
  }

  deleteCharacter(id: number) {
    return this.#http.delete(`${API}/characters/${id}`);
  }

  refresh(): void {
    this.#refreshTrigger.update((v) => v + 1);
  }
}
