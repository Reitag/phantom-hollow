import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { SpellPower } from '@/components/stats/damage';
import { SpriteConfig } from '@/utils/types';
import { SPELL_ANIMATION_KEYS } from '@/constants/animation-keys';
import { CRITICAL_MULTIPLIER, SHIFT_SPELL_REGGISTER_HITS } from '@/constants/object-stats';
import { Z_POSITION } from '@/constants/z-position';
import { FireBall } from '@/entities/spells/direct-spells/fire-ball';
import { Sandbox } from '@/infrastructure/sandbox';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { playAnimation } from '@/utils/helpers';
import { Character } from './character';

type AudioKeys = {
  launch: string | undefined;
  impact: string | undefined;
  critImpact: string | undefined;
  action: string | undefined;
};

export interface SpellConfig extends SpriteConfig {
  caster: Character;
  spellPower?: SpellPower;
  damage?: number;
  speed?: number;
  direction?: number;
}

export abstract class Spell extends ArcadeSprite {
  protected caster: Character;
  protected spellPower: SpellPower | null = null;
  protected damage: number | null = null;
  protected speed: number | null = null;
  protected direction: number | null = null;
  protected audioKeys: AudioKeys;
  protected sandbox: Sandbox;
  protected relicId: 'fire-relic' | 'frost-relic' | null = null;

  protected hittedEnemies = new Array<Character>();
  private criticalHit = false;

  constructor({
    scene,
    position,
    keyName,
    frame,
    caster,
    spellPower,
    damage,
    speed,
    direction,
  }: SpellConfig) {
    super({ scene, position, keyName, frame });

    this.caster = caster;

    this.spellPower = spellPower || null;
    this.damage = damage || null;
    this.speed = speed || null;
    this.direction = direction || null;

    this.sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);

    this.audioKeys = {
      launch: undefined,
      impact: undefined,
      critImpact: undefined,
      action: undefined,
    };

    this.setDepth(Z_POSITION.SPELL);
  }

  public get isCritical(): boolean {
    return this.criticalHit;
  }

  public abstract cast(): void;
  public abstract applyEffect(target: Character): void;

  public setCriticalHit(): void {
    this.criticalHit = true;
  }

  public playLaunchSound(config?: Phaser.Types.Sound.SoundConfig | undefined): void {
    if (this.audioKeys.launch) {
      ServiceLocator.resolve(ServiceKeys.audio).play(this.audioKeys.launch, config);
      this.audioKeys.launch = undefined;
    }
  }

  public playImpactSound(config?: Phaser.Types.Sound.SoundConfig | undefined): void {
    if (this.audioKeys.impact) {
      ServiceLocator.resolve(ServiceKeys.audio).play(this.audioKeys.impact, config);
      this.audioKeys.impact = undefined;
    }
  }

  public playCritImpactSound(config?: Phaser.Types.Sound.SoundConfig | undefined): void {
    if (this.audioKeys.critImpact) {
      ServiceLocator.resolve(ServiceKeys.audio).play(this.audioKeys.critImpact, config);
      this.audioKeys.critImpact = undefined;
    }
  }

  public playActionSound(config?: Phaser.Types.Sound.SoundConfig | undefined): void {
    if (this.audioKeys.action) {
      ServiceLocator.resolve(ServiceKeys.audio).play(this.audioKeys.action, config);
      this.audioKeys.action = undefined;
    }
  }

  public destroySpell(): void {
    if (!this.animations) return;
    if (this.direction) {
      this.setVelocityX(80 * this.direction);
    }
    const animKey = this.resolveAnimation(SPELL_ANIMATION_KEYS.HIT);
    playAnimation(this, animKey);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.onDestroyStart?.();
      this.destroy();
    });
  }

  public hasAlreadyHit(enemy: Character): boolean {
    return this.hittedEnemies.includes(enemy);
  }

  public registerHit(enemy: Character): void {
    this.hittedEnemies.push(enemy);

    enemy.scene.time.delayedCall(SHIFT_SPELL_REGGISTER_HITS, () => {
      this.hittedEnemies.shift();
    });
  }

  public causeDamage(): number {
    if (!this.damage) return 0;

    let finalDamage = this.damage;

    if (!this.spellPower) return finalDamage;

    if (this instanceof FireBall && this.spellPower.isCriticalStrike) {
      finalDamage *= CRITICAL_MULTIPLIER;
    }

    return finalDamage * this.spellPower.multiplier;
  }

  public getCaster(): Character {
    return this.caster;
  }

  protected onDestroyStart?(): void {}

  protected playStartAnimation(): void {
    if (!this.animations) return;
    if (this.direction !== 1) {
      this.setFlipX(true);
    }
    const animKey = this.resolveAnimation(SPELL_ANIMATION_KEYS.START);
    playAnimation(this, animKey);
  }

  protected playMainAnimation(): void {
    if (!this.animations) return;
    if (this.direction !== 1) {
      this.setFlipX(true);
    }
    const animKey = this.resolveAnimation(SPELL_ANIMATION_KEYS.MAIN);
    playAnimation(this, animKey);
  }

  protected setSpellVelocity(): void {
    this.scene.physics.world.once('worldstep', () => {
      if (this.speed != null && this.direction != null) {
        this.setVelocityX(this.speed * this.direction);
      }
    });
  }

  protected isEnemyHitAtLeastOnce(): boolean {
    if (this.hittedEnemies.length > 0) {
      // Overrides this method during the call
      this.isEnemyHitAtLeastOnce = () => false;
      return true;
    }
    return false;
  }
}
