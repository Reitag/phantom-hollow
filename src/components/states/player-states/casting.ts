import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/core/character-state';
import { SPELLS } from '@/constants/asset-keys';
import { FIRE_BALL_STATS } from '@/constants/object-stats';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { Player } from '@/objects/characters/player/player';

export class Casting extends CharacterState {
  private isCasting = false;
  private isInstantCasting = false;

  constructor(
    character: Player,
    input?: KeyboardController,
    spellManager?: SpellManager,
    ui?: UiManager
  ) {
    super('Casting', character, input, spellManager, ui);
  }

  public onEnter(...args: unknown[]): void {
    const spell = args.find((elem): elem is string => typeof elem === 'string');
    if (spell === undefined) throw new Error('Expected string spell argument');

    switch (spell) {
      case SPELLS.FIRE_BALL:
        this.startCast(FIRE_BALL_STATS.CAST_TIME, this.animations.attack, () => {
          if (!this.character.getDead()) {
            this.spellManager?.castFireball();
          }
        });
        break;

      case SPELLS.BLINK:
        this.spellManager?.castBlink();
        break;

      case SPELLS.WIND:
        this.startInstantCast(this.animations.instantCast, () => {
          if (!this.character.getDead()) {
            this.spellManager?.castWind();
          }
        });
        break;

      default:
        break;
    }
  }

  public onUpdate(): void {
    if (!this.isCasting && !this.isInstantCasting) {
      this.stateMachine.changeState('Idle');
      return;
    }

    if (
      (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) &&
      this.isCasting
    ) {
      this.isCasting = false;
      this.character.anims.stop();
      this.ui?.stopCast();
      this.stateMachine.changeState('Movement');
    }
  }

  private startCast(duration: number, animation: string | undefined, onComplete: () => void): void {
    this.isCasting = true;
    this.playAnimation(animation);

    this.ui?.startCast(duration, () => {
      this.isCasting = false;
      onComplete();
    });
  }

  private startInstantCast(animation: string | undefined, onComplete: () => void): void {
    this.isInstantCasting = true;
    this.playAnimation(animation);

    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.isInstantCasting = false;
    });
    onComplete();
  }
}
