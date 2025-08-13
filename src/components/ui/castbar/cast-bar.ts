import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { castUi, castBar } from '@/utils/coordinates';

export class CastBar {
  public frame!: Phaser.GameObjects.Image;
  public bar!: Phaser.GameObjects.Image;
  public mask!: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene) {}

  setCastBar(): void {
    this.bar = this.scene.add.image(castBar.x, castBar.y, 'cast-bar').setOrigin(0, 0.5);
    this.frame = this.scene.add.image(castUi.x, castUi.y, 'cast-env').setOrigin(0, 0.5);

    this.mask = new GraphicsMask(this.scene)
      .roundedRect({
        x: castBar.x,
        y: castBar.y,
        width: castBar.width,
        height: castBar.height,
      })
      .applyTo(this.bar);

    this.mask.scaleX = 0;
  }

  setCompletedTexture(): void {
    this.bar.setTexture('cast-bar-green');
  }

  destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.mask.destroy();
  }
}
