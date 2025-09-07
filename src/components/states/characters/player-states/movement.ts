import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { SpellManager } from '@/managers/spell-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';
import { PLAYER_STATS } from '@/constants/object-stats';

export class Movement extends CharacterState {
  constructor(character: Player, input?: KeyboardController, spellManager?: SpellManager) {
    super('Movement', character, input, spellManager);
  }

  public onEnter(...args: unknown[]): void {
    if (this.input?.isUpPressed) {
      this.jump();
    }
  }

  public onUpdate(): void {
    this.movement();

    if (!this.input?.isLeftDown && !this.input?.isRightDown) {
      this.changeToIdleState();
    }

    if (this.input?.isUpPressed) {
      this.jump();
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

  private changeToIdleState(): void {
    if (this.characterBody.blocked.down) {
      this.stateMachine.changeState('Idle');
    }
  }

  private movement(): void {
    if (this.input?.isLeftDown) {
      this.moveLeft(this.characterMovement.getCurrentSpeed());
    } else if (this.input?.isRightDown) {
      this.moveRight(this.characterMovement.getCurrentSpeed());
    } else {
      this.character.setVelocityX(0);
    }
  }
}
