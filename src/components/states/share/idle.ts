import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { SHARED_STATES } from '@/constants/state-keys';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Idle extends CharacterState {
  constructor(character: Character) {
    super(SHARED_STATES.IDLE, character);
  }

  public onEnter(...args: unknown[]): void {
    if (!this.character.active) return;
    this.setToZeroVelocityX();

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
    this.playAnimation(animKey, true);
  }

  public onUpdate(): void {}

  public onExit(): void {}
}
