import { CharacterState } from '@/components/states/core/character-state';
import { Character } from '@/objects/core/character';

export class Wait extends CharacterState {
  constructor(character: Character) {
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
