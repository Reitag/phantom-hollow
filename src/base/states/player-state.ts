import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { SpellSystem } from '@/systems/spell-system';
import { PLAYER_STATES } from '@/constants/state-keys';
import { UiSystem } from '@/systems/ui-system';
import { InventorySystem } from '@/systems/inventory-system';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { CharacterState } from './character-state';
import { Character } from '../objects/character';

export abstract class PlayerState extends CharacterState {
  private uiCoords: Phaser.Types.Tilemaps.TiledObject[];
  constructor(
    name: string,
    character: Character,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem,
    inventory?: InventorySystem
  ) {
    super(name, character, input, spellSystem, ui, inventory);

    this.uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);
  }

  protected movement(): void {
    if (this.input?.isLeftDown) {
      this.moveLeft(this.characterSpeed?.velocity);
    } else if (this.input?.isRightDown) {
      this.moveRight(this.characterSpeed?.velocity);
    } else {
      this.character.setVelocityX(0);
    }
  }

  protected jump(): void {
    if (this.characterBody.blocked.down) {
      this.stateMachine.changeState(PLAYER_STATES.JUMP);
    }
  }
}
