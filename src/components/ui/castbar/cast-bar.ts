import Phaser from 'phaser';
import { UI } from '@/constants/asset-keys';
import { CAST_UI, CAST_BAR } from '@/constants/ui-coordinates';

export class CastBar {
  public frame!: Phaser.GameObjects.Image;
  public bar!: Phaser.GameObjects.Image;
  public maskGraphics!: Phaser.GameObjects.Graphics;
  public mask!: Phaser.Display.Masks.GeometryMask;

  public progressWidth = 0;

  constructor(private scene: Phaser.Scene) {}

  public setCastBar(): void {
    this.bar = this.scene.add.image(CAST_BAR.X, CAST_BAR.Y, UI.CAST_BAR).setOrigin(0, 0.5);
    this.frame = this.scene.add.image(CAST_UI.X, CAST_UI.Y, UI.CAST_ENV).setOrigin(0, 0.5);

    this.maskGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    this.updateMask(0);

    this.mask = this.maskGraphics.createGeometryMask();
    this.bar.setMask(this.mask);
  }

  public updateMask(progressWidth: number): void {
    this.maskGraphics.clear();
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRoundedRect(
      CAST_BAR.X,
      CAST_BAR.Y - CAST_BAR.HEIGHT / 2,
      progressWidth,
      CAST_BAR.HEIGHT,
      1
    );
  }

  public getFullWidth(): number {
    return CAST_BAR.WIDTH;
  }

  public setCompletedTexture(): void {
    this.bar.setTexture(UI.CAST_BAR_GREEN);
  }

  public destroy(): void {
    this.frame.destroy();
    this.bar.destroy();
    this.maskGraphics.destroy();
    this.mask.destroy();
  }
}
