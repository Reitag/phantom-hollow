import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CharacterState } from '@/base/states/character-state';
import { SPELLS } from '@/constants/asset-keys';
import { PLAYER_STATES } from '@/constants/state-keys';
import { FIRE_BALL_STATS, FROST_BOLT_STATS } from '@/constants/object-stats';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { Player } from '@/entities/characters/player/player';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Casting extends CharacterState {
  private isCasting = false;
  private isInstantCasting = false;

  constructor(
    character: Player,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem
  ) {
    super(PLAYER_STATES.CASTING, character, input, spellSystem, ui);
  }

  public onEnter(...args: unknown[]): void {
    const spell = args.find((elem): elem is string => typeof elem === 'string');
    if (spell === undefined) throw new Error('Expected string spell argument');

    switch (spell) {
      case SPELLS.FIRE_BALL:
        this.startCast(FIRE_BALL_STATS.CAST_TIME, () => {
          if (!this.character.getDead()) {
            this.spellSystem?.castFireball(this.character);
          }
        });
        break;

      case SPELLS.BLINK:
        this.spellSystem?.castBlink(this.character);
        break;

      case SPELLS.WIND:
        this.startInstantCast(() => {
          if (!this.character.getDead()) {
            this.spellSystem?.castWind(this.character);
          }
        });
        break;

      case SPELLS.FROST_BOLT:
        this.startCast(FROST_BOLT_STATS.CAST_TIME, () => {
          if (!this.character.getDead()) {
            this.spellSystem?.castFrostbolt(this.character);
          }
        });
        break;

      default:
        break;
    }
  }

  public onUpdate(): void {
    if (!this.isCasting && !this.isInstantCasting) {
      this.stateMachine.changeState(PLAYER_STATES.IDLE);
      return;
    }

    if (
      (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) &&
      this.isCasting
    ) {
      this.isCasting = false;
      this.character.anims.stop();
      this.ui?.stopCast();
      this.stateMachine.changeState(PLAYER_STATES.MOVEMENT);
    }
  }

  private startCast(duration: number, onComplete: () => void): void {
    this.isCasting = true;

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST);
    this.playAnimation(animKey, false, duration);

    this.ui?.startCast(duration, () => {
      this.isCasting = false;
      onComplete();
    });
  }

  private startInstantCast(onComplete: () => void): void {
    this.isInstantCasting = true;

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.INSTANT_CAST);
    this.playAnimation(animKey);

    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.isInstantCasting = false;
    });
    onComplete();
  }
}
