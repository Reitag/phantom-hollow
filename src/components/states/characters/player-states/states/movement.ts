import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { PlayerState } from '@/components/states/characters/player-states/core/player-state';
import { SpellManager } from '@/managers/spell-manager';
import { Player } from '@/objects/characters/player/player';

export class Movement extends PlayerState {
  constructor(player: Player, input?: KeyboardController, spellManager?: SpellManager) {
    super('Movement', player, input, spellManager);
  }

  onEnter(...args: unknown[]): void {
    this.useJump();
  }

  onUpdate(): void {
    this.useJump();
    this.useMovement();
    this.changeToIdleState();

    if (this.input?.isPrimaryActionDown) {
      this.initToCastSpell(this.primaryActionName);
    }

    if (this.input?.isSecondaryActionDown) {
      this.initToCastSpell(this.secondaryActionName);
    }
  }
}
