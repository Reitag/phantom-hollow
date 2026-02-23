import Phaser from 'phaser';

import { UiSystem } from '@/systems/ui-system';
import { UI } from '@/constants/asset-keys';
import { createUiTilemap } from '@/tilemap/tilemap-ui';
import { Tilemap } from '@/components/map/tilemap';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';

export class UiScene extends Phaser.Scene {
  private ui!: UiSystem;
  private uiTilemapCoords!: Tilemap;

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
  }
}
