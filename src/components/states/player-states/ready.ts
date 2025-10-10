import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { UiSystem } from '@/systems/ui-system';
import { Player } from '@/entities/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';

export class Ready extends CharacterState {
  constructor(player: Player, input?: KeyboardController, ui?: UiSystem) {
    super('Ready', player, input, undefined, ui);
  }

  public onEnter(...args: unknown[]): void {}

  public onUpdate(delta: number): void {
    this.characterSpeed?.update(delta);
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
      this.moveLeft(this.characterSpeed?.velocity);
    } else if (this.input?.isRightDown) {
      this.moveRight(this.characterSpeed?.velocity);
    }
  }
}
