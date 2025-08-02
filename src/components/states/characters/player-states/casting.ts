import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { Player } from '@/objects/characters/player/player';

export class Casting extends CharacterState {
  private isCasting = false;

  constructor(
    character: Player,
    input?: KeyboardController,
    spellManager?: SpellManager,
    ui?: UiManager
  ) {
    super('Casting', character, input, spellManager, ui);
  }

  onEnter(...args: unknown[]): void {
    if (this.input?.isPrimaryActionReleased) {
      this.isCasting = true;
      const duration = 800;
      this.playAnimation(this.animations.attack);

      this.ui?.startCast(duration, () => {
        if (this.character.getDead()) return;

        this.spellManager?.castFireball();
        this.isCasting = false;
      });
    }
  }

  onUpdate(): void {
    if (!this.isCasting) {
      this.stateMachine.changeState('Idle');
      return;
    }

    if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
      this.isCasting = false;
      this.character.anims.stop();
      this.ui?.stopCast();
      this.stateMachine.changeState('Movement');
    }
  }
}
