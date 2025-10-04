import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/core/character-state';
import { SpellManager } from '@/managers/spell-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS } from '@/constants/asset-keys';
import { InventoryManager } from '@/managers/inventory-manager';
import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';

export class Idle extends CharacterState {
  private inventory!: InventoryManager;

  constructor(character: Player, input?: KeyboardController, spellManager?: SpellManager) {
    super('Idle', character, input, spellManager);
  }

  public onEnter(...args: unknown[]): void {
    this.character.setVelocityX(0);
    this.playAnimation(this.animations.idle);
    this.inventory = ServiceLocator.resolve(ServiceKeys.inventoryManager);
  }

  public onUpdate(): void {
    this.inventory.handleInput(this.input);

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
