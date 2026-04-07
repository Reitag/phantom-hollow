import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { SpellPower } from '@/components/stats/damage';
import { PlayerState } from '@/base/states/player-state';
import { AUDIO, SPELLS } from '@/constants/asset-keys';
import { PLAYER_STATES } from '@/constants/state-keys';
import { FIRE_BALL_STATS, FROST_BOLT_STATS } from '@/constants/object-stats';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { Player } from '@/entities/characters/player/player';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { ARCANE_MIND } from '@/constants/modifier-stats';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class Casting extends PlayerState {
  private isCasting = false;
  private isInstantCasting = false;
  private castTime: number = 1;
  private sound: Phaser.Sound.BaseSound | null = null;

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
        if ((this.character.getStats().damage.spellPower as SpellPower).isInstantCast) {
          this.startInstantCast(() => {
            if (!this.character.getDead()) {
              this.consumeInstantBuff();
              this.spellSystem?.castFireball(this.character);
            }
          });
        } else {
          const castTime = this.character.getStats()?.casting?.value;
          if (castTime !== undefined) this.castTime = castTime;

          this.startCast(FIRE_BALL_STATS.CAST_TIME * this.castTime, () => {
            if (!this.character.getDead()) {
              this.spellSystem?.castFireball(this.character);
            }
          });
        }
        break;

      case SPELLS.BLINK:
        this.spellSystem?.castBlink(this.character);
        break;

      case SPELLS.WIND_WAVE:
        this.startInstantCast(() => {
          if (!this.character.getDead()) {
            this.spellSystem?.castWindPulse(this.character);
          }
        });
        break;

      case SPELLS.FROST_BOLT: {
        const castTime = this.character.getStats()?.casting?.value;
        if (castTime !== undefined) this.castTime = castTime;

        this.startCast(FROST_BOLT_STATS.CAST_TIME * this.castTime, () => {
          if (!this.character.getDead()) {
            this.spellSystem?.castFrostbolt(this.character);
          }
        });

        break;
      }

      default:
        break;
    }
  }

  public onUpdate(): void {
    // For instant cast, movement is able
    if (this.isInstantCasting) {
      if (this.input?.isUpPressed) {
        this.jump();
      }
      this.movement();
      return;
    }

    if (!this.isCasting && !this.isInstantCasting) {
      this.stateMachine.changeState(PLAYER_STATES.IDLE);
      return;
    }

    if (
      (this.input?.isLeftDown ||
        this.input?.isRightDown ||
        this.input?.isUpPressed ||
        this.input?.isDownDown) &&
      this.isCasting
    ) {
      this.isCasting = false;
      this.character.anims.stop();
      this.sound?.stop();
      this.ui?.stopCast();

      if (this.input?.isLeftDown || this.input?.isRightDown || this.input?.isUpPressed) {
        this.stateMachine.changeState(PLAYER_STATES.MOVEMENT);
      } else if (this.input?.isDownDown) {
        this.stateMachine.changeState(PLAYER_STATES.DUCK);
      }
    }
  }

  private consumeInstantBuff(): void {
    (this.character.getStats().damage.spellPower as SpellPower).allowInstantCast = false;
    this.character.getModifier().removeModifier(ARCANE_MIND.id);

    this.ui?.removeModifierIcon(ARCANE_MIND.id);
  }

  private startCast(duration: number, onComplete: () => void): void {
    const audioSystem = ServiceLocator.resolve(ServiceKeys.audio);

    const animStartCast = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.CAST_START);
    const animMainCast = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN);
    const animEndCast = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.CAST_END);

    this.sound = audioSystem.playControlled(AUDIO.CASTING);

    this.isCasting = true;

    this.ui?.startCast(duration);
    this.playAnimation(animStartCast, true);
    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animStartCast, () => {
      if (this.isCasting) {
        this.playAnimation(animMainCast, true);
      }
    });

    this.character.scene.time.delayedCall(duration, () => {
      if (this.isCasting) {
        if (!this.character.getDead()) this.playAnimation(animEndCast);
        onComplete();
        this.sound?.stop();

        this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animEndCast, () => {
          this.isCasting = false;
        });
      }
    });
  }

  private startInstantCast(onComplete: () => void): void {
    this.isInstantCasting = true;

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.INSTANT_CAST);
    this.playAnimation(animKey);

    this.character.scene.time.delayedCall(200, () => {
      this.isInstantCasting = false;
    });

    onComplete();
  }

  protected override moveLeft(speed: number | undefined): void {
    if (!speed) return;

    this.character.setVelocityX(-speed);
    this.character.flipCharacterToRight(false);
  }

  protected override moveRight(speed: number | undefined): void {
    if (!speed) return;

    this.character.setVelocityX(speed);
    this.character.flipCharacterToRight(true);
  }
}
