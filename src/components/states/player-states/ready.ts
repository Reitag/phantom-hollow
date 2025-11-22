import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { PLAYER_STATES } from '@/constants/state-keys';
import { UiSystem } from '@/systems/ui-system';
import { Player } from '@/entities/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Ready extends CharacterState {
  constructor(player: Player, input?: KeyboardController, ui?: UiSystem) {
    super(PLAYER_STATES.READY, player, input, undefined, ui);
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

      const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
      this.playAnimation(animKey);
    }

    if (
      !this.input?.isPrimaryActionDown &&
      !this.input?.isSecondaryActionDown &&
      !this.input?.isTertiaryActionDown &&
      !this.input?.isQuaternaryActionDown
    ) {
      this.ui?.removeHighlight();
      if (this.input?.isLeftDown || this.input?.isRightDown) {
        this.stateMachine.changeState(PLAYER_STATES.MOVEMENT);
      } else {
        this.stateMachine.changeState(PLAYER_STATES.IDLE);
      }
    }

    if (this.input?.isPrimaryActionDown) {
      this.ui?.highlightSpell(SPELLS.FIRE_BALL);
    } else if (this.input?.isPrimaryActionReleased) {
      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.FIRE_BALL);
      return;
    }

    if (this.input?.isSecondaryActionDown) {
      this.ui?.highlightSpell(SPELLS.BLINK);
    } else if (this.input?.isSecondaryActionReleased) {
      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.BLINK);
      return;
    }

    if (this.input?.isTertiaryActionDown) {
      this.ui?.highlightSpell(SPELLS.WIND);
    } else if (this.input?.isTertiaryActionReleased) {
      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.WIND);
      return;
    }

    if (this.input?.isQuaternaryActionDown) {
      this.ui?.highlightSpell(SPELLS.FROST_BOLT);
    } else if (this.input?.isQuaternaryActionReleased) {
      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.FROST_BOLT);
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
