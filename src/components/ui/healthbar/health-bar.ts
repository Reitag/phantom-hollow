import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { UI } from '@/constants/asset-keys';
import { HEALTH_UI, HEALTH_BAR } from '@/constants/ui-coordinates';

export class HealthBar {
  public frame: Phaser.GameObjects.Image;
  public bar: Phaser.GameObjects.Image;
  public mask: Phaser.GameObjects.Graphics | null = null;

  constructor(private scene: Phaser.Scene) {
    this.bar = scene.add.image(HEALTH_BAR.X, HEALTH_BAR.Y, UI.HEALTH_BAR).setOrigin(0, 0.5);
    this.frame = scene.add.image(HEALTH_UI.X, HEALTH_UI.Y, UI.HEALTH_ENV).setOrigin(0, 0.5);

    this.setMask();
  }

  public setMask(): void {
    if (this.mask) {
      this.mask = null;
    }

    this.mask = new GraphicsMask(this.scene)
      .roundedRect({
        x: HEALTH_BAR.X,
        y: HEALTH_BAR.Y,
        width: HEALTH_BAR.WIDTH,
        height: HEALTH_BAR.HEIGHT,
      })
      .applyTo(this.bar);
  }

  public getFrame(): Phaser.GameObjects.Image {
    return this.frame;
  }

  public getBar(): Phaser.GameObjects.Image {
    return this.bar;
  }

  public getMask(): Phaser.GameObjects.Graphics | null {
    return this.mask;
  }

  public destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.mask?.destroy();
  }
}
