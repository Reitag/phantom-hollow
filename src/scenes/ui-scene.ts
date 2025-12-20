import Phaser from 'phaser';

import { UiSystem } from '@/systems/ui-system';
import { UI } from '@/constants/asset-keys';
import {
  SPELL_UI,
  INVENTORY_UI,
  FIREBALL_ICON,
  BLINK_ICON,
  WIND_ICON,
  INVENTORY_SLOTS,
  COIN_UI,
  FROST_BOLT_ICON,
} from '@/constants/ui-coordinates';
import { SPELL_TOOLTIPS } from '@/constants/tooltip-params';

export class UiScene extends Phaser.Scene {
  private ui!: UiSystem;

  constructor() {
    super('UiScene');
  }

  public create(): void {
    // UI panels
    this.add.image(SPELL_UI.X, SPELL_UI.Y, UI.SPELL_UI).setOrigin(0, 0.5);
    this.add.image(INVENTORY_UI.X, INVENTORY_UI.Y, UI.INVENTORY_UI).setOrigin(0, 0.5);

    // Coin icon
    this.add.image(COIN_UI.X, COIN_UI.Y, UI.COIN_UI).setOrigin(0, 0.5);

    // Spell icons
    const fireball = this.add
      .image(FIREBALL_ICON.X, FIREBALL_ICON.Y, UI.FIRE_BALL_ICON)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.FIREBALL);
    const blink = this.add
      .image(BLINK_ICON.X, BLINK_ICON.Y, UI.BLINK_ICON)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.BLINK);
    const wind = this.add
      .image(WIND_ICON.X, WIND_ICON.Y, UI.WIND_ICON)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.WIND);
    const frostbolt = this.add
      .image(FROST_BOLT_ICON.X, FROST_BOLT_ICON.Y, UI.FROSTBOLT_ICON)
      .setInteractive({ useHandCursor: true })
      .setData('spell', SPELL_TOOLTIPS.FROSTBOLT);

    // Spell labels
    this.addKeyLabel(fireball, 'Z');
    this.addKeyLabel(blink, 'X');
    this.addKeyLabel(wind, 'C');
    this.addKeyLabel(frostbolt, 'V');

    // Inventory labels
    this.addInventoryKeyLabels();

    this.ui = new UiSystem(this);

    this.tooltipSpellsInit({ fireball: fireball, blink: blink, wind: wind, frostbolt: frostbolt });
  }

  public getUI(): UiSystem {
    return this.ui;
  }

  private addKeyLabel(icon: Phaser.GameObjects.Image, keyText: string): void {
    this.add
      .text(icon.x + 16, icon.y - 5, keyText, {
        font: '12px Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(1, 1)
      .setDepth(10)
      .setAlpha(0.9);
  }

  private addInventoryKeyLabels(): void {
    const INVENTORY_KEYS = ['A', 'S', 'D', 'F'];

    INVENTORY_KEYS.forEach((key, index) => {
      const x = INVENTORY_SLOTS.START_X + index * (INVENTORY_SLOTS.WIDTH + INVENTORY_SLOTS.PADDING);
      const y = INVENTORY_SLOTS.Y;

      this.add
        .text(x + INVENTORY_SLOTS.WIDTH - 2, y - INVENTORY_SLOTS.HEIGHT - 7, key, {
          font: '12px Arial',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        })
        .setOrigin(1, 0)
        .setDepth(10)
        .setAlpha(0.9);
    });
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
