import { User } from '../../../auth/shared/interfaces/user.interface';
import { Character } from '../../../characters/shared/interfaces/character.interface';

export interface Board {
  id: number;
  name: string;
  backgroundImage?: string;
  dm?: User;
  characters: Character[];
  initiativeOrder: number[];
  currentTurnIndex: number;
  createdAt: string;
}

export interface MoveCharacterRequest {
  characterId: number;
  x: number;
  y: number;
}
