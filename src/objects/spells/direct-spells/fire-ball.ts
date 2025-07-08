import Phaser from 'phaser';

import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { PhysicsSpriteConfig } from '@/utils/types';
import { DEPTH } from '@/utils/constants';

interface FireBallConfig extends PhysicsSpriteConfig {
  direction: number;
}

export class FireBall extends PhysicsSprite {
  private direction: number;
  private damage: number;

  constructor({ scene, position, keyName, frame, direction }: FireBallConfig) {
    super({ scene, position, keyName, frame });

    this.direction = direction;
    this.damage = 120;

    this.setDepth(DEPTH.SPELL);

    scene.physics.world.once('worldstep', () => {
      this.setWorldColliding();
      this.setVelocityX(300 * direction);
    });

    this.playAnimation(direction);
  }

  setWorldColliding(): void {
    this.setCollideWorldBounds(true);
    this.arcadeBody.setAllowGravity(false);
    this.arcadeBody.onWorldBounds = true;

    this.arcadeBody.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === this) {
        this.destroy();
      }
    });
  }

  getDamage(): number {
    return this.damage;
  }

  private playAnimation(direction: number): void {
    if (direction !== 1) {
      this.setFlipX(true);
    }

    this.anims.play('fire-ball-anim');
  }

  destroyFireBall(): void {
    this.setVelocityX(80 * this.direction);
    this.anims.play('fire-ball-anim-destroy', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}
