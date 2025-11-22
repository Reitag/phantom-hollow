import Phaser from 'phaser';

import { AnimationMap, SpriteConfig } from '@/utils/types';
import { isArcadePhysicsBody } from '@/utils/helpers';

export class ArcadeSprite extends Phaser.Physics.Arcade.Sprite {
  protected arcadeBody: Phaser.Physics.Arcade.Body;
  protected keyName: string;
  protected animations: AnimationMap = {};

  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    const { x, y } = position;
    super(scene, x, y, keyName, frame);

    this.keyName = keyName;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (isArcadePhysicsBody(this.body)) {
      this.arcadeBody = this.body;
    } else {
      throw new Error(
        `[PhysicsSprite] - Body is not an Arcade Physics Body. Check physics config.`
      );
    }
  }

  public getArcadeBody(): Phaser.Physics.Arcade.Body {
    return this.arcadeBody;
  }

  public getAnimations(): AnimationMap {
    return this.animations;
  }

  public resolveAnimation(key: string): string | undefined {
    return this.animations[key];
  }
}
