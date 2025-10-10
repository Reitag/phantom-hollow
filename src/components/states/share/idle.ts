import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';

export class Idle extends CharacterState {
  constructor(character: Character) {
    super('Idle', character);
  }

  public onEnter(...args: unknown[]): void {
    this.setToZeroVelocityX();
    this.playAnimation(this.animations.idle, true);
  }

  public onUpdate(): void {}

  public onExit(): void {}
}
