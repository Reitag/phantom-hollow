import Phaser from 'phaser';

import { PhysicsSpriteConfig } from '@/utils/types';
import { isArcadePhysicsBody } from '@/utils/helpers';

export class PhysicsSprite extends Phaser.Physics.Arcade.Sprite {
  protected arcadeBody!: Phaser.Physics.Arcade.Body;
  protected keyName: string;

  constructor({ scene, position, keyName, frame }: PhysicsSpriteConfig) {
    const { x, y } = position;
    super(scene, x, y, keyName, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (isArcadePhysicsBody(this.body)) {
      this.arcadeBody = this.body;
    } else {
      console.log(this.body);
      throw new Error(
        `[PhysicsSprite] - Body is not an Arcade Physics Body. Check physics config.`
      );
    }

    this.keyName = keyName;
  }
}
