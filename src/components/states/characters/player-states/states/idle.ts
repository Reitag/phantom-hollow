import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { PlayerState } from '@/components/states/characters/player-states/core/player-state';
import { SpellManager } from '@/managers/spell-manager';
import { Player } from '@/objects/characters/player/player';

export class Idle extends PlayerState {
  constructor(player: Player, input?: KeyboardController, spellManager?: SpellManager) {
    super('Idle', player, input, spellManager);
  }

  onEnter(...args: unknown[]): void {
    if (this.input?.isSecondaryActionReleased) {
      this.player.secondarySpell();
    }
    this.player.idle();
  }

  onUpdate(): void {
    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.stateMachine.changeState('Movement');
    }

    if (this.input?.isPrimaryActionDown) {
      this.initToCastSpell(this.primaryActionName);
    }

    if (this.input?.isSecondaryActionDown) {
      this.initToCastSpell(this.secondaryActionName);
    }
  }
}
