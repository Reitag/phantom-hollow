import { UI } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';

export class HealthBar {
  public frame: Phaser.GameObjects.Image;
  public bar: Phaser.GameObjects.Image;
  public mask: Phaser.GameObjects.Graphics | null = null;

  constructor(private scene: Phaser.Scene) {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);
    const bar = getUiCoords(uiCoords, 'health-bar');
    const frame = getUiCoords(uiCoords, 'health-env');

    this.frame = scene.add.image(frame.x, frame.y, UI.HEALTH_ENV).setOrigin(0, 0);
    this.bar = scene.add.image(bar.x, bar.y, UI.HEALTH_BAR).setOrigin(0, 0);

    this.setMask();
  }

  public setMask(): void {
    if (this.mask) {
      this.mask = null;
    }
    const color = 0xffffff;

    this.mask = this.scene.add.graphics();
    this.mask.visible = false;
    this.mask.fillStyle(color);
    this.mask.fillRect(this.bar.x, this.bar.y, this.bar.width, this.bar.height);

    this.bar.setMask(this.mask.createGeometryMask());
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
