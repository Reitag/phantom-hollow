import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { UiManager } from '@/managers/ui-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS, VELOCITY } from '@/utils/constants';

export class Ready extends CharacterState {
  constructor(player: Player, input?: KeyboardController, ui?: UiManager) {
    super('Ready', player, input, undefined, ui);
  }

  onEnter(...args: unknown[]): void {}

  onUpdate(): void {
    this.movement();

    if (this.input?.isUpPressed) {
      this.jump();
    }

    if (!this.input?.isLeftDown && !this.input?.isRightDown) {
      this.setToZeroVelocityX();
      this.playAnimation(this.animations.idle);
    }

    if (!this.input?.isPrimaryActionDown && !this.input?.isSecondaryActionDown) {
      this.ui?.removeHighlight();
      if (this.input?.isLeftDown || this.input?.isRightDown) {
        this.stateMachine.changeState('Movement');
      } else {
        this.stateMachine.changeState('Idle');
      }
    }

    if (this.input?.isPrimaryActionDown) {
      this.ui?.highlightSpell(SPELLS.FIREBALL);
    } else if (this.input?.isPrimaryActionReleased) {
      this.ui?.removeHighlight();
      this.stateMachine.changeState('Casting');
      return;
    }

    if (this.input?.isSecondaryActionDown) {
      this.ui?.highlightSpell(SPELLS.BLINK);
    } else if (this.input?.isSecondaryActionReleased) {
      this.ui?.removeHighlight();
      this.stateMachine.changeState('Idle');
      return;
    }
  }

  private movement(): void {
    const speed = VELOCITY.PLAYER_VELOCITY.MOVE;

    if (this.input?.isLeftDown) {
      this.moveLeft(speed);
    } else if (this.input?.isRightDown) {
      this.moveRight(speed);
    }
  }
}
