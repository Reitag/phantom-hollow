import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { PlayerState } from '@/components/states/characters/player-states/core/player-state';
import { Player } from '@/objects/characters/player/player';

export class Casting extends PlayerState {
  constructor(player: Player, input?: KeyboardController) {
    super('Casting', player, input);
  }

  onEnter(...args: unknown[]): void {
    if (this.input?.isPrimaryActionReleased) {
      this.player.primarySpell();
    }
  }

  onUpdate(): void {
    if (!this.player.getIsCasting()) {
      this.stateMachine.changeState('Idle');
      return;
    }

    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.player.stopCasting();
      this.stateMachine.changeState('Movement');
    }
  }
}
