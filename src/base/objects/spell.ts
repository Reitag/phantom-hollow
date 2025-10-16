import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { SpellPower } from '@/components/stats/damage';
import { ArcadeSpriteConfig, SpellAnimationConfig } from '@/utils/types';
import { Z_POSITION } from '@/constants/z-position';
import { playAnimation } from '@/utils/helpers';
import { Character } from './character';

export interface SpellConfig extends ArcadeSpriteConfig {
  caster: Character;
  spellPower?: SpellPower;
  animation?: SpellAnimationConfig;
  damage?: number;
  speed?: number;
  direction?: number;
}

export abstract class Spell extends ArcadeSprite {
  protected caster: Character;
  protected spellPower: SpellPower | null = null;
  protected animation: SpellAnimationConfig | null = null;
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
    animation,
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
    this.animation = animation || null;

    this.setDepth(Z_POSITION.SPELL);
  }

  public abstract cast(): void;

  public applyEffect(target: Character): void {}

  public destroySpell(): void {
    if (!this.animation) return;
    if (this.direction) {
      this.setVelocityX(80 * this.direction);
    }
    playAnimation(this, this.animation.destroy);

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

  protected playMainAnimation(): void {
    if (!this.animation) return;
    if (this.direction !== 1) {
      this.setFlipX(true);
    }
    playAnimation(this, this.animation.main);
  }

  protected setSpellVelocity(): void {
    this.scene.physics.world.once('worldstep', () => {
      if (this.speed != null && this.direction != null) {
        this.setVelocityX(this.speed * this.direction);
      }
    });
  }
}
