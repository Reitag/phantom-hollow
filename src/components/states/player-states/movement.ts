import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { PLAYER_STATES } from '@/constants/state-keys';
import { InventorySystem } from '@/systems/inventory-system';
import { SpellSystem } from '@/systems/spell-system';
import { Player } from '@/entities/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';

export class Movement extends CharacterState {
  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    inventory?: InventorySystem
  ) {
    super(PLAYER_STATES.MOVEMENT, character, input, spellSystem, undefined, inventory);
  }

  public onEnter(...args: unknown[]): void {
    if (this.input?.isUpPressed) {
      this.jump();
    }
  }

  public onUpdate(delta: number): void {
    this.characterSpeed?.update(delta);
    this.inventory?.handleInput(this.input);
    this.movement();

    if (!this.input?.isLeftDown && !this.input?.isRightDown) {
      this.changeToIdleState();
    }

    if (this.input?.isUpPressed) {
      this.jump();
    }

    if (this.input?.isPrimaryActionDown) {
      this.initToCastSpell(SPELLS.FIRE_BALL);
    }

    if (this.input?.isSecondaryActionDown) {
      this.initToCastSpell(SPELLS.BLINK);
    }

    if (this.input?.isTertiaryActionDown) {
      this.initToCastSpell(SPELLS.WIND);
    }

    if (this.input?.isQuaternaryActionDown) {
      this.initToCastSpell(SPELLS.FROST_BOLT);
    }
  }

  private changeToIdleState(): void {
    if (this.characterBody.blocked.down) {
      this.stateMachine.changeState(PLAYER_STATES.IDLE);
    }
  }

  private movement(): void {
    if (this.input?.isLeftDown) {
      this.moveLeft(this.characterSpeed?.velocity);
    } else if (this.input?.isRightDown) {
      this.moveRight(this.characterSpeed?.velocity);
    } else {
      this.character.setVelocityX(0);
    }
  }
}
