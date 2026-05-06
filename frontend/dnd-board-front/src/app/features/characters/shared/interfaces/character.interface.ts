export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterPosition {
  x: number;
  y: number;
}

export interface Character {
  id: number;
  userId: number;
  name: string;
  hp: number;
  speed: number;
  stats: CharacterStats;
  position?: CharacterPosition;
}
