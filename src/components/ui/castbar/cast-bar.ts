import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { castUi, castBar } from '@/utils/coordinates';

export class CastBar {
  public frame: Phaser.GameObjects.Image;
  public bar: Phaser.GameObjects.Image;
  public mask: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.bar = scene.add.image(castBar.x, castBar.y, 'cast-bar').setOrigin(0, 0.5);
    this.frame = scene.add.image(castUi.x, castUi.y, 'cast-env').setOrigin(0, 0.5);

    this.mask = new GraphicsMask(scene)
      .roundedRect({
        x: castBar.x,
        y: castBar.y,
        width: castBar.width,
        height: castBar.height,
      })
      .applyTo(this.bar);

    this.mask.scaleX = 0;
  }

  resetTexture(): void {
    this.bar.setTexture('cast-bar');
  }

  setCompletedTexture(): void {
    this.bar.setTexture('cast-bar-green');
  }

  reset(): void {
    this.mask.scaleX = 0;
    this.bar.alpha = 1;
    this.resetTexture();
  }

  destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.mask.destroy();
  }
}
