import { UiSystem } from '@/systems/ui-system';
import { UI } from '@/constants/asset-keys';
import { createUiTilemap } from '@/tilemap/tilemap-ui';
import { Tilemap } from '@/components/map/tilemap';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';
import { BaseScene } from '@/base/scene/base-scene';

export class UiScene extends BaseScene {
  private ui!: UiSystem;
  private uiTilemapCoords!: Tilemap;
  private startMissionBtn: Phaser.GameObjects.Image | null = null;
  private overlayGraphics: Phaser.GameObjects.Graphics | null = null;

  constructor() {
    super('UiScene');
  }

  public create(): void {
    this.createCoordLayer();
    this.registerUiObjects();

    this.ui = new UiSystem(this);

    // Miscs
    this.createMiscIcons();
  }

  public getUI(): UiSystem {
    return this.ui;
  }

  private createCoordLayer(): void {
    this.uiTilemapCoords = createUiTilemap(this);
  }

  private registerUiObjects(): void {
    const coordLayer = this.uiTilemapCoords.getObjectLayer('coord-layer');
    if (!coordLayer) throw new Error('No coord layer');

    ServiceLocator.register(ServiceKeys.uiCoords, coordLayer.objects);
  }

  private createMiscIcons(): void {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    const coinCoord = getUiCoords(uiCoords, 'coin-icon');
    this.add.image(coinCoord.x, coinCoord.y, UI.COIN_UI).setOrigin(0, 0);

    // Start mission Button
    /*this.startMissionBtn = this.add
      //.image(500, 500, UI.INFO_BUTTON)
      .image(720, 595, UI.INFO_BUTTON)
      .setInteractive()
      .setOrigin(0, 0);
    this.startMissionBtn.on('pointerup', this.handleStartMissionBtn, this);

    // Start mission overlay
    this.overlayGraphics = this.add.graphics();

    this.overlayGraphics.fillStyle(0xffd700, 1);
    this.overlayGraphics.fillRoundedRect(
      this.startMissionBtn.x,
      this.startMissionBtn.y,
      this.startMissionBtn.width,
      this.startMissionBtn.height,
      3
    );

    this.overlayGraphics.setAlpha(0);

    this.tweens.add({
      targets: this.overlayGraphics,
      alpha: 0.8,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });*/
  }

  private detachStartMissionBtn(): void {
    this.startMissionBtn?.off('pointerup', this.handleStartMissionBtn, this);
    this.startMissionBtn?.destroy();
    this.startMissionBtn = null;
  }

  private handleStartMissionBtn(): void {
    if (this.overlayGraphics) {
      this.tweens.killTweensOf(this.overlayGraphics);
      this.overlayGraphics.destroy();
      this.overlayGraphics = null;
    }
    this.detachStartMissionBtn();
    this.scene.launch('StartGameScene').bringToTop('StartGameScene');
  }

  protected cleanup(): void {
    this.detachStartMissionBtn();
  }
}
