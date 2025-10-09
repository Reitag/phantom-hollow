import { Character } from '@/objects/core/character';
import { ModifierType } from '@/utils/types';

export interface Modifier {
  id: string;
  duration: number;
  type: ModifierType;

  apply(target: Character): void;
  start(target: Character, onExpire: () => void): void;
}
