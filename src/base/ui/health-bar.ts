import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';

interface HealthBarConfig {
  barKey: string;
  frameKey: string;
  barTexture: string;
  frameTexture: string;
  visibleByDefault?: boolean;
}

export abstract class HealthBar {
  public frame: Phaser.GameObjects.Image;
  public bar: Phaser.GameObjects.Image;
  protected mask!: Phaser.GameObjects.Graphics;

  constructor(
    protected scene: Phaser.Scene,
    config: HealthBarConfig
  ) {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    const barCoords = getUiCoords(uiCoords, config.barKey);
    const frameCoords = getUiCoords(uiCoords, config.frameKey);

    this.frame = scene.add
      .image(frameCoords.x, frameCoords.y, config.frameTexture)
      .setOrigin(0, 0)
      .setVisible(config.visibleByDefault ?? true);

    this.bar = scene.add
      .image(barCoords.x, barCoords.y, config.barTexture)
      .setOrigin(0, 0)
      .setVisible(config.visibleByDefault ?? true);

    this.setMask();
  }

  public setMask(): void {
    this.mask = this.scene.add.graphics();
    this.mask.visible = false;
    this.mask.fillStyle(0xffffff);
    this.mask.fillRect(this.bar.x, this.bar.y, this.bar.width, this.bar.height);

    this.bar.setMask(this.mask.createGeometryMask());
  }

  public getMask(): Phaser.GameObjects.Graphics {
    return this.mask;
  }

  public show(): void {
    this.frame.setVisible(true);
    this.bar.setVisible(true);
  }

  public hide(): void {
    this.frame.setVisible(false);
    this.bar.setVisible(false);
  }

  public destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.mask.destroy();
  }
}
