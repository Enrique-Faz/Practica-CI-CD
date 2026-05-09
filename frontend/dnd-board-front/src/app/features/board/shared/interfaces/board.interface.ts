import { User } from '../../../auth/shared/interfaces/user.interface';
import { Character } from '../../../characters/shared/interfaces/character.interface';
import { BoardMap } from '../types/board-map.enum';

export interface InitiativeEntry {
  characterId: number;
}

export interface Board {
  id: number;
  name: string;
  joinCode?: string;
  backgroundImage?: BoardMap;
  gridCols?: number;
  gridRows?: number;
  dm?: User;
  characters: Character[];
  initiativeOrder: InitiativeEntry[] | null;
  currentTurnIndex: number;
  createdAt: string;
}

export interface MoveCharacterRequest {
  characterId: number;
  x: number;
  y: number;
}

export interface UpdateGridRequest {
  gridCols: number;
  gridRows: number;
}

export interface GridCell {
  col: number;
  row: number;
}
