import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/core/character-state';
import { UiManager } from '@/managers/ui-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';

export class Ready extends CharacterState {
  constructor(player: Player, input?: KeyboardController, ui?: UiManager) {
    super('Ready', player, input, undefined, ui);
  }

  public onEnter(...args: unknown[]): void {}

  public onUpdate(): void {
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

  public onExit(): void {
    this.ui?.removeHighlight();
  }

  private movement(): void {
    if (this.input?.isLeftDown) {
      this.moveLeft(this.characterMovement.getCurrentSpeed());
    } else if (this.input?.isRightDown) {
      this.moveRight(this.characterMovement.getCurrentSpeed());
    }
  }
}
