import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { PlayerState } from '@/components/states/characters/player-states/core/player-state';
import { UiManager } from '@/managers/ui-manager';
import { Player } from '@/objects/characters/player/player';

export class Ready extends PlayerState {
  constructor(player: Player, input?: KeyboardController, ui?: UiManager) {
    super('Ready', player, input, undefined, ui);
  }

  onEnter(...args: unknown[]): void {}

  onUpdate(): void {
    this.useMovement();
    this.useJump();

    // Handle idle animation if no movement input
    if (!this.input?.isLeftDown && !this.input?.isRightDown) {
      this.player.idle(); // <- reset animation to idle
    }

    // Return to idle if no keys are held
    if (!this.input?.isPrimaryActionDown && !this.input?.isSecondaryActionDown) {
      this.ui?.removeHighlight();
      this.stateMachine.changeState('Idle');
    }

    // Primary spell logic
    if (this.input?.isPrimaryActionDown) {
      this.ui?.highlightSpell(this.primaryActionName);
    } else if (this.input?.isPrimaryActionReleased) {
      this.ui?.removeHighlight();
      this.stateMachine.changeState('Casting');
      return;
    }

    // Secondary spell logic
    if (this.input?.isSecondaryActionDown) {
      this.ui?.highlightSpell(this.secondaryActionName);
    } else if (this.input?.isSecondaryActionReleased) {
      this.ui?.removeHighlight();
      this.stateMachine.changeState('Idle');
      return;
    }
  }
}
