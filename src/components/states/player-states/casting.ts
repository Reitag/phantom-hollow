import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { SPELLS } from '@/constants/asset-keys';
import { FIRE_BALL_STATS } from '@/constants/object-stats';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { Player } from '@/entities/characters/player/player';

export class Casting extends CharacterState {
  private isCasting = false;
  private isInstantCasting = false;

  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem
  ) {
    super('Casting', character, input, spellSystem, ui);
  }

  public onEnter(...args: unknown[]): void {
    const spell = args.find((elem): elem is string => typeof elem === 'string');
    if (spell === undefined) throw new Error('Expected string spell argument');

    switch (spell) {
      case SPELLS.FIRE_BALL:
        this.startCast(FIRE_BALL_STATS.CAST_TIME, this.animations.attack, () => {
          if (!this.character.getDead()) {
            this.spellSystem?.castFireball(this.character);
          }
        });
        break;

      case SPELLS.BLINK:
        this.spellSystem?.castBlink(this.character);
        break;

      case SPELLS.WIND:
        this.startInstantCast(this.animations.instantCast, () => {
          if (!this.character.getDead()) {
            this.spellSystem?.castWind(this.character);
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
