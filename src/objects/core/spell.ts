import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { Sandbox } from '@/components/sandbox/sandbox';
import { PhysicsSpriteConfig, SpellAnimationConfig } from '@/utils/types';
import { Z_POSITION } from '@/constants/z-position';
import { playAnimation } from '@/utils/helpers';

export interface SpellConfig extends PhysicsSpriteConfig {
  sandbox: Sandbox;
  animation: SpellAnimationConfig;
  damage?: number;
  speed?: number;
  direction?: number;
}

export abstract class Spell extends PhysicsSprite {
  protected sandbox: Sandbox;
  protected animation: SpellAnimationConfig;
  protected damage: number | null = null;
  protected speed: number | null = null;
  protected direction: number | null = null;

  constructor({
    scene,
    position,
    keyName,
    frame,
    sandbox,
    animation,
    damage,
    speed,
    direction,
  }: SpellConfig) {
    super({ scene, position, keyName, frame });

    this.damage = damage || null;
    this.speed = speed || null;
    this.direction = direction || null;
    this.animation = animation;
    this.sandbox = sandbox;

    this.setDepth(Z_POSITION.SPELL);
  }

  abstract cast(): void;

  public destroySpell(): void {
    if (this.direction) {
      this.setVelocityX(80 * this.direction);
    }
    playAnimation(this, this.animation.destroy);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }

  public causeDamage(): number {
    if (!this.damage) {
      return 0;
    }

    const damage = this.damage;
    this.damage = 0;

    return damage;
  }

  protected playMainAnimation(): void {
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
