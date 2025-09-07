import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { SpellManager } from '@/managers/spell-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';

export class Idle extends CharacterState {
  constructor(character: Player, input?: KeyboardController, spellManager?: SpellManager) {
    super('Idle', character, input, spellManager);
  }

  public onEnter(...args: unknown[]): void {
    this.character.setVelocityX(0);
    this.playAnimation(this.animations.idle);
  }

  public onUpdate(): void {
    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.stateMachine.changeState('Movement');
    }

    if (this.input?.isPrimaryActionDown) {
      this.initToCastSpell(SPELLS.FIRE_BALL);
    }

    if (this.input?.isSecondaryActionDown) {
      this.initToCastSpell(SPELLS.BLINK);
    }

    if (this.input?.isTertiaryActionDown) {
      this.initToCastSpell(SPELLS.WIND);
    }
  }
}
