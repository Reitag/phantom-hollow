import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';

export class Wait extends CharacterState {
  constructor(character: Character) {
    super('Wait', character);
  }

  public onEnter(...args: unknown[]): void {
    this.characterSpeed?.setMovementLock(true);
    this.playAnimation(this.animations.idle, true);
  }

  public onUpdate(delta: number): void {}

  public onExit(): void {
    this.characterSpeed?.setMovementLock(false);
  }
}
