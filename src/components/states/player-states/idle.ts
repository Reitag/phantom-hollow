import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { PLAYER_STATES } from '@/constants/state-keys';
import { SpellSystem } from '@/systems/spell-system';
import { Player } from '@/entities/characters/player/player';
import { InventorySystem } from '@/systems/inventory-system';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { PlayerState } from '@/base/states/player-state';
import { UiSystem } from '@/systems/ui-system';

export class Idle extends PlayerState {
  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem,
    inventory?: InventorySystem
  ) {
    super(PLAYER_STATES.IDLE, character, input, spellSystem, ui, inventory);
  }

  public onEnter(...args: unknown[]): void {
    this.character.setVelocityX(0);

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
    this.playAnimation(animKey);
  }

  public onUpdate(): void {
    if (this.input?.isUpPressed) {
      this.jump();
    }

    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.stateMachine.changeState(PLAYER_STATES.MOVEMENT);
    }

    if (this.input?.isDownDown) {
      this.stateMachine.changeState(PLAYER_STATES.DUCK);
    }
  }
}
