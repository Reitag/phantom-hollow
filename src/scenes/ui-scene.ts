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
} from '@/constants/ui-coordinates';

export class UiScene extends Phaser.Scene {
  private ui!: UiSystem;

  constructor() {
    super('UiScene');
  }

  create(): void {
    // UI panels
    this.add.image(SPELL_UI.X, SPELL_UI.Y, UI.SPELL_UI).setOrigin(0, 0.5);
    this.add.image(INVENTORY_UI.X, INVENTORY_UI.Y, UI.INVENTORY_UI).setOrigin(0, 0.5);

    // Spell icons
    const fireball = this.add.image(FIREBALL_ICON.X, FIREBALL_ICON.Y, UI.FIRE_BALL_ICON);
    const blink = this.add.image(BLINK_ICON.X, BLINK_ICON.Y, UI.BLINK_ICON);
    const wind = this.add.image(WIND_ICON.X, WIND_ICON.Y, UI.WIND_ICON);

    // Spell labels
    this.addKeyLabel(fireball, 'Z');
    this.addKeyLabel(blink, 'X');
    this.addKeyLabel(wind, 'C');

    // Inventory labels
    this.addInventoryKeyLabels();

    this.ui = new UiSystem(this);
  }

  getUI(): UiSystem {
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
}
