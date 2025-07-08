import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { healthUi, healthBar } from '@/utils/coordinates';

export class HealthBar {
  public frame: Phaser.GameObjects.Image;
  public bar: Phaser.GameObjects.Image;
  public mask: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.bar = scene.add.image(healthBar.x, healthBar.y, 'health-bar').setOrigin(0, 0.5);
    this.frame = scene.add.image(healthUi.x, healthUi.y, 'health-env').setOrigin(0, 0.5);

    this.mask = new GraphicsMask(scene)
      .roundedRect({
        x: healthBar.x,
        y: healthBar.y,
        width: healthBar.width,
        height: healthBar.height,
      })
      .applyTo(this.bar);
  }

  getFrame(): Phaser.GameObjects.Image {
    return this.frame;
  }

  getBar(): Phaser.GameObjects.Image {
    return this.bar;
  }

  getMask(): Phaser.GameObjects.Graphics {
    return this.mask;
  }

  destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.mask.destroy();
  }
}
