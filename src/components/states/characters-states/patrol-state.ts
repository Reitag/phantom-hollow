import { BaseState } from '@/components/states/characters-states/base-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';

export class PatrolState extends BaseState {
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
