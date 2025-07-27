import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';

export class Patrol extends CharacterState {
  constructor(character: SkeletonWarrior) {
    super('Patrol', character);
  }

  onEnter(...args: unknown[]): void {
    if (this.character.getFacingRight()) {
      this.character.moveRight(60);
    } else {
      this.character.moveLeft(60);
    }
  }

  onUpdate(): void {
    this.character.patrol();
  }
}
