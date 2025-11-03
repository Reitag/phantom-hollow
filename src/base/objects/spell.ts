import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { SpellPower } from '@/components/stats/damage';
import { ArcadeSpriteConfig } from '@/utils/types';
import { SPELL_ANIMATION_KEYS } from '@/constants/animation-keys';
import { Z_POSITION } from '@/constants/z-position';
import { playAnimation } from '@/utils/helpers';
import { Character } from './character';

export interface SpellConfig extends ArcadeSpriteConfig {
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

  private hittedEnemies = new Set<Character>();

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

    this.setDepth(Z_POSITION.SPELL);
  }

  public abstract cast(): void;
  public abstract applyEffect(target: Character): void;

  public destroySpell(): void {
    if (!this.animations) return;
    if (this.direction) {
      this.setVelocityX(80 * this.direction);
    }
    const animKey = this.resolveAnimation(SPELL_ANIMATION_KEYS.HIT);
    playAnimation(this, animKey);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }

  public hasAlreadyHit(enemy: Character): boolean {
    return this.hittedEnemies.has(enemy);
  }

  public registerHit(enemy: Character): void {
    this.hittedEnemies.add(enemy);
  }

  public causeDamage(): number {
    if (!this.damage) return 0;
    if (!this.spellPower) return this.damage;
    return this.damage * this.spellPower.multiplier;
  }

  public getCaster(): Character {
    return this.caster;
  }

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
}
