import Phaser from 'phaser';
import { UI } from '@/constants/asset-keys';
import { Position } from '@/utils/types';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';

export class CastBar {
  public progressWidth?: number;
  public bar?: Phaser.GameObjects.Image;

  private frame?: Phaser.GameObjects.Image;
  private maskGraphics?: Phaser.GameObjects.Graphics;
  private mask?: Phaser.Display.Masks.GeometryMask;

  private frameCoords: Position;
  private barCoords: Position;

  private initialized = false;

  constructor(private scene: Phaser.Scene) {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);
    this.frameCoords = getUiCoords(uiCoords, 'cast-env');
    this.barCoords = getUiCoords(uiCoords, 'cast-bar');
  }

  public setCastBar(): void {
    if (this.initialized) return;

    this.bar = this.scene.add
      .image(this.barCoords.x, this.barCoords.y, UI.CAST_BAR)
      .setOrigin(0, 0);

    this.frame = this.scene.add
      .image(this.frameCoords.x, this.frameCoords.y, UI.CAST_ENV)
      .setOrigin(0, 0);

    this.maskGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    this.updateMask(0);

    this.mask = this.maskGraphics.createGeometryMask();
    this.bar.setMask(this.mask);

    this.initialized = true;
  }

  public updateMask(progressWidth: number): void {
    if (!this.initialized) return;
    if (!this.maskGraphics || !this.bar) return;

    this.maskGraphics.clear();
    this.maskGraphics.fillStyle(0xffffff);

    this.maskGraphics.fillRoundedRect(
      this.barCoords.x,
      this.barCoords.y,
      progressWidth,
      this.bar.height,
      1
    );
  }

  public getFullWidth(): number {
    if (!this.initialized || !this.bar) return 0;
    return this.bar.width;
  }

  public setCompletedTexture(): void {
    if (!this.initialized) return;
    if (!this.bar || !this.bar.active) return;

    this.bar.setTexture(UI.CAST_BAR_GREEN);
  }

  public destroy(): void {
    if (!this.initialized) return;

    this.frame?.destroy();
    this.bar?.destroy();
    this.maskGraphics?.destroy();
    this.mask?.destroy();

    this.frame = undefined;
    this.bar = undefined;
    this.maskGraphics = undefined;
    this.mask = undefined;

    this.initialized = false;
  }
}
