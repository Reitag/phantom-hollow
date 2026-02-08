import { Character } from '@/base/objects/character';
import { PLAYER_STATES } from '@/constants/state-keys';
import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { InventorySystem } from '@/systems/inventory-system';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { PLAYER_STATS } from '@/constants/object-stats';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { PlayerState } from '@/base/states/player-state';

export class Jump extends PlayerState {
  constructor(
    character: Character,
    input: KeyboardController,
    spellSystem: SpellSystem,
    ui: UiSystem,
    inventory: InventorySystem
  ) {
    super(PLAYER_STATES.JUMP, character, input, spellSystem, ui, inventory);
  }

  public onEnter(): void {
    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.JUMP);
    this.playAnimation(animKey, true);
    this.character.setVelocityY(PLAYER_STATS.JUMP * -1);

    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (!this.characterBody.blocked.down) {
        this.stateMachine.changeState(PLAYER_STATES.FALL);
      }
    });
  }

  public onUpdate(delta: number): void {
    this.characterSpeed?.update(delta);
    this.movement();

    if (this.characterBody.blocked.down) this.stateMachine.changeState(PLAYER_STATES.IDLE);
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
