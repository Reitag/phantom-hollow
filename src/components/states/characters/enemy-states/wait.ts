import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';

export class Wait extends CharacterState {
  constructor(character: SkeletonWarrior) {
    super('Wait', character);
  }

  public onEnter(...args: unknown[]): void {
    this.characterMovement.setMovementLock(true);
    this.playAnimation(this.animations.idle, true);
  }

  public onUpdate(): void {}

  public onExit(): void {
    this.characterMovement.setMovementLock(false);
  }
}
