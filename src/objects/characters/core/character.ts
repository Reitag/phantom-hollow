import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { PhysicsSpriteConfig } from '@/utils/types';

export interface CharacterConfig extends PhysicsSpriteConfig {
  health: number;
  facingRight: boolean;
}

export class Character extends PhysicsSprite {
  protected health: number;
  protected facingRight!: boolean;
  protected isDead: boolean;
  protected isVulnerable: boolean;

  constructor({ scene, position, keyName, frame, health, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, frame });

    this.health = health;
    this.isDead = false;
    this.isVulnerable = false;
    this.facingRight = facingRight;

    if (!this.facingRight) {
      this.setFlipX(true);
    }

    this.setCollideWorldBounds(true);
  }

  getFacingRight(): boolean {
    return this.facingRight;
  }

  getDead(): boolean {
    return this.isDead;
  }

  playHitEffect(): void {
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => this.clearTint());
  }
}
