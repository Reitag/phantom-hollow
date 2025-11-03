import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { PLAYER_STATES } from '@/constants/state-keys';
import { SpellSystem } from '@/systems/spell-system';
import { Player } from '@/entities/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';
import { InventorySystem } from '@/systems/inventory-system';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Idle extends CharacterState {
  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    inventory?: InventorySystem
  ) {
    super(PLAYER_STATES.IDLE, character, input, spellSystem, undefined, inventory);
  }

  public onEnter(...args: unknown[]): void {
    this.character.setVelocityX(0);

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
    this.playAnimation(animKey);
  }

  public onUpdate(): void {
    this.inventory?.handleInput(this.input);

    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.stateMachine.changeState(PLAYER_STATES.MOVEMENT);
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
}
