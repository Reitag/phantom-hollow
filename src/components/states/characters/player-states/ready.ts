import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { UiManager } from '@/managers/ui-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';
import { PLAYER_STATS } from '@/constants/object-stats';

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

    if (
      !this.input?.isPrimaryActionDown &&
      !this.input?.isSecondaryActionDown &&
      !this.input?.isTertiaryActionDown
    ) {
      this.ui?.removeHighlight();
      if (this.input?.isLeftDown || this.input?.isRightDown) {
        this.stateMachine.changeState('Movement');
      } else {
        this.stateMachine.changeState('Idle');
      }
    }

    if (this.input?.isPrimaryActionDown) {
      this.ui?.highlightSpell(SPELLS.FIRE_BALL);
    } else if (this.input?.isPrimaryActionReleased) {
      this.stateMachine.changeState('Casting', SPELLS.FIRE_BALL);
      return;
    }

    if (this.input?.isSecondaryActionDown) {
      this.ui?.highlightSpell(SPELLS.BLINK);
    } else if (this.input?.isSecondaryActionReleased) {
      this.stateMachine.changeState('Casting', SPELLS.BLINK);
      return;
    }

    if (this.input?.isTertiaryActionDown) {
      this.ui?.highlightSpell(SPELLS.WIND);
    } else if (this.input?.isTertiaryActionReleased) {
      this.stateMachine.changeState('Casting', SPELLS.WIND);
      return;
    }
  }

  onExit(): void {
    this.ui?.removeHighlight();
  }

  private movement(): void {
    const speed = PLAYER_STATS.MOVE;

    if (this.input?.isLeftDown) {
      this.moveLeft(speed);
    } else if (this.input?.isRightDown) {
      this.moveRight(speed);
    }
  }
}
