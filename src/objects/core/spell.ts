import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { PhysicsSpriteConfig, SpellAnimationConfig } from '@/utils/types';
import { DEPTH } from '@/utils/constants';

export interface SpellConfig extends PhysicsSpriteConfig {
  animation: SpellAnimationConfig;
  damage?: number;
  speed?: number;
  direction?: number;
}

export abstract class Spell extends PhysicsSprite {
  protected animation: SpellAnimationConfig;
  protected damage: number | null = null;
  protected speed: number | null = null;
  protected direction: number | null = null;

  constructor({
    scene,
    position,
    keyName,
    frame,
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

    this.setDepth(DEPTH.SPELL);
    this.setSpellGravity();
  }

  public destroySpell(): void {
    if (this.direction) {
      this.setVelocityX(80 * this.direction);
    }
    this.playAnimation(this.animation.destroy);

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

  protected playAnimation(key: string | undefined, force = false): void {
    if (!key) return;
    if (!force && this.anims.currentAnim?.key === key) return;
    this.anims.play(key, true);
  }

  protected playMainAnimation(): void {
    if (this.direction !== 1) {
      this.setFlipX(true);
    }
    this.playAnimation(this.animation.main);
  }

  protected setSpellVelocity(): void {
    this.scene.physics.world.once('worldstep', () => {
      if (this.speed != null && this.direction != null) {
        this.setVelocityX(this.speed * this.direction);
      }
    });
  }

  protected setSpellGravity(): void {
    this.arcadeBody.setAllowGravity(false);
  }
}
