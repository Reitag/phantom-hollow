import { Z_POSITION } from '@/constants/z-position';
import { SpriteConfig } from '@/utils/types';

export class Sprite extends Phaser.GameObjects.Sprite {
  protected keyName: string;

  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    const { x, y } = position;
    super(scene, x, y, keyName, frame);

    this.keyName = keyName;

    scene.add.existing(this);

    this.setDepth(Z_POSITION.MISC);
  }
}
