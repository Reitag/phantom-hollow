import Phaser from 'phaser';

import { UiSystem } from '@/systems/ui-system';
import { UI } from '@/constants/asset-keys';
import { SPELL_TOOLTIPS } from '@/constants/tooltip-params';
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

    // Spell icons
    this.createSpellIcons();
    // Inventory Slots
    //this.createInventorySlots();
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

  private createSpellIcons(): void {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    const primary = getUiCoords(uiCoords, 'primary');
    const secondary = getUiCoords(uiCoords, 'secondary');
    const tertiary = getUiCoords(uiCoords, 'tertiary');
    const quaternary = getUiCoords(uiCoords, 'quaternary');

    const fireball = this.add
      .image(primary.x, primary.y, UI.FIRE_BALL_ICON)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.FIREBALL);
    const blink = this.add
      .image(secondary.x, secondary.y, UI.BLINK_ICON)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.BLINK);
    const wind = this.add
      .image(tertiary.x, tertiary.y, UI.WIND_ICON)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.WIND);
    const frostbolt = this.add
      .image(quaternary.x, quaternary.y, UI.FROSTBOLT_ICON)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.FROSTBOLT);

    // Tooltips
    this.tooltipSpellsInit({ fireball: fireball, blink: blink, wind: wind, frostbolt: frostbolt });

    // Spell labels
    this.addKeyLabel(fireball, 'Z');
    this.addKeyLabel(blink, 'X');
    this.addKeyLabel(wind, 'C');
    this.addKeyLabel(frostbolt, 'V');
  }

  private createInventorySlots(): void {
    const INVENTORY_KEYS = ['A', 'S', 'D', 'F'];

    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    const slot1 = getUiCoords(uiCoords, 'slot-1');
    const slot2 = getUiCoords(uiCoords, 'slot-2');
    const slot3 = getUiCoords(uiCoords, 'slot-3');
    const slot4 = getUiCoords(uiCoords, 'slot-4');

    [slot1, slot2, slot3, slot4].forEach((slot, index) => {
      const image = this.add.image(slot.x, slot.y, UI.INVENTORY_SLOT).setOrigin(0, 0);

      //this.addKeyLabel(image, INVENTORY_KEYS[index]);
    });
  }

  private addKeyLabel(icon: Phaser.GameObjects.Image, keyText: string): void {
    this.add
      .text(icon.x + 22, icon.y - 5, keyText, {
        font: '12px Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0, 0)
      .setDepth(10)
      .setAlpha(0.9);
  }

  private tooltipSpellsInit(spells: {
    fireball: Phaser.GameObjects.Image;
    blink: Phaser.GameObjects.Image;
    wind: Phaser.GameObjects.Image;
    frostbolt: Phaser.GameObjects.Image;
  }): void {
    const { fireball, blink, wind, frostbolt } = spells;

    [fireball, blink, wind, frostbolt].forEach((spell) => {
      spell.on('pointerover', (pointer: Phaser.Input.Pointer) => {
        this.scene.scene.game.canvas.style.cursor = 'help';
        const info = spell.getData('spell');
        this.ui.showVerticalTooltip(
          {
            x: spell.x - 50,
            y: spell.y - 30,
            width: 300,
            fillColor: 0x000000,
          },
          info
        );
      });

      spell.on('pointerout', this.ui.hideTooltip, this.ui);
    });
  }
}
