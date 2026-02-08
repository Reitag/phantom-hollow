import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { PLAYER_STATES } from '@/constants/state-keys';
import { PlayerState } from '@/base/states/player-state';
import { InventorySystem } from '@/systems/inventory-system';
import { SpellSystem } from '@/systems/spell-system';
import { Player } from '@/entities/characters/player/player';
import { UiSystem } from '@/systems/ui-system';

export class Movement extends PlayerState {
  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem,
    inventory?: InventorySystem
  ) {
    super(PLAYER_STATES.MOVEMENT, character, input, spellSystem, ui, inventory);
  }

  public onEnter(...args: unknown[]): void {
    if (this.input?.isUpPressed) {
      this.jump();
    }
  }

  public onUpdate(delta: number): void {
    this.characterSpeed?.update(delta);

    if (this.input?.isDownDown) {
      this.character.setVelocityX(0);
      this.stateMachine.changeState(PLAYER_STATES.DUCK);
    } else {
      this.movement();
    }

    if (!this.input?.isLeftDown && !this.input?.isRightDown) {
      this.changeToIdleState();
    }

    if (this.input?.isUpPressed) {
      this.jump();
    }
  }

  private changeToIdleState(): void {
    if (this.characterBody.blocked.down) {
      this.stateMachine.changeState(PLAYER_STATES.IDLE);
    }
  }
}
