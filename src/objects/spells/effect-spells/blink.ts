import Phaser from 'phaser';

import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { PhysicsSpriteConfig } from '@/utils/types';
import { DEPTH } from '@/utils/constants';

export class Blink extends PhysicsSprite {
  constructor({ scene, position, keyName, frame }: PhysicsSpriteConfig) {
    super({ scene, position, keyName, frame });

    this.arcadeBody.setAllowGravity(false);
    this.setDepth(DEPTH.SPELL);

    this.playBlinkEffect();
  }

  private playBlinkEffect(): void {
    this.anims.play('blink-anim', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}
