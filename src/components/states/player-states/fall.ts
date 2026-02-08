import { Character } from '@/base/objects/character';
import { PlayerState } from '@/base/states/player-state';
import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';
import { PLAYER_STATES } from '@/constants/state-keys';
import { InventorySystem } from '@/systems/inventory-system';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';

export class Fall extends PlayerState {
  constructor(
    character: Character,
    input: KeyboardController,
    spellSystem: SpellSystem,
    ui: UiSystem,
    inventory: InventorySystem
  ) {
    super(PLAYER_STATES.FALL, character, input, spellSystem, ui, inventory);
  }

  public onEnter(): void {
    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.FALL);
    this.playAnimation(animKey, true);
  }

  public onUpdate(delta: number): void {
    this.characterSpeed?.update(delta);
    this.movement();

    if (this.characterBody.blocked.down) {
      this.character.setTexture(CHARACTERS.PLAYER, 38);
      this.character.scene.time.delayedCall(50, () => {
        if (!this.character.getDead()) {
          this.stateMachine.changeState(PLAYER_STATES.MOVEMENT);
        }
      });
    }
  }

  public onExit(): void {}

  protected override moveLeft(speed: number | undefined): void {
    if (!speed) return;

    this.setVelocityToX(-speed);
    this.flipCharacterToRight(false);
  }

  protected override moveRight(speed: number | undefined): void {
    if (!speed) return;

    this.setVelocityToX(speed);
    this.flipCharacterToRight(true);
  }
}
