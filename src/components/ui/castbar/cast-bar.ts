import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { UI } from '@/constants/asset-keys';
import { CAST_UI, CAST_BAR } from '@/constants/ui-coordinates';

export class CastBar {
  public frame!: Phaser.GameObjects.Image;
  public bar!: Phaser.GameObjects.Image;
  public mask!: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene) {}

  setCastBar(): void {
    this.bar = this.scene.add.image(CAST_BAR.X, CAST_BAR.Y, UI.CAST_BAR).setOrigin(0, 0.5);
    this.frame = this.scene.add.image(CAST_UI.X, CAST_UI.Y, UI.CAST_ENV).setOrigin(0, 0.5);

    this.mask = new GraphicsMask(this.scene)
      .roundedRect({
        x: CAST_BAR.X,
        y: CAST_BAR.Y,
        width: CAST_BAR.WIDTH,
        height: CAST_BAR.HEIGHT,
      })
      .applyTo(this.bar);

    this.mask.scaleX = 0;
  }

  setCompletedTexture(): void {
    this.bar.setTexture(UI.CAST_BAR_GREEN);
  }

  destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.mask.destroy();
  }
}
