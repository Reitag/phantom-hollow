import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';

export class Wait extends CharacterState {
  constructor(character: SkeletonWarrior) {
    super('Wait', character);
  }

  onEnter(...args: unknown[]): void {
    this.setToZeroVelocityX();
    this.playAnimation(this.animations.idle, true);
  }

  onUpdate(): void {}
}
