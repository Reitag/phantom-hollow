import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { SpellSystem } from '@/systems/spell-system';
import { Player } from '@/entities/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';
import { InventorySystem } from '@/systems/inventory-system';

export class Idle extends CharacterState {
  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    inventory?: InventorySystem
  ) {
    super('Idle', character, input, spellSystem, undefined, inventory);
  }

  public onEnter(...args: unknown[]): void {
    this.character.setVelocityX(0);
    this.playAnimation(this.animations.idle);
  }

  public onUpdate(): void {
    this.inventory?.handleInput(this.input);

    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.stateMachine.changeState('Movement');
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
  }
}
