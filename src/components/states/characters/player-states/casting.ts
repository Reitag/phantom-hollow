import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { SPELLS } from '@/constants/asset-keys';
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
    const spell = args.find((elem): elem is string => typeof elem === 'string');
    if (spell === undefined) throw new Error('Expected string spell argument');

    switch (spell) {
      case SPELLS.FIRE_BALL:
        this.startCast(spell, 800, () => {
          if (!this.character.getDead()) {
            this.spellManager?.castFireball();
          }
        });
        break;

      case SPELLS.BLINK:
        this.spellManager?.castBlink();
        break;

      case SPELLS.WIND:
        this.spellManager?.castWind();
        break;

      default:
        break;
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

  private startCast(spell: string, duration: number, onComplete: () => void): void {
    this.isCasting = true;
    this.playAnimation(this.animations.attack);

    this.ui?.startCast(duration, () => {
      this.isCasting = false;
      onComplete();
    });
  }
}
