import { Character } from '@/objects/core/character';

export interface Modifier {
  id: string;
  duration: number;

  apply(target: Character): void;
  start(target: Character, onExpire: () => void): void;
}
