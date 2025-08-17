import Phaser from 'phaser';

import { UiManager } from '@/managers/ui-manager';
import { UI } from '@/constants/asset-keys';
import { SPELL_UI, FIREBALL_ICON, BLINK_ICON } from '@/constants/ui-coordinates';

export class UiScene extends Phaser.Scene {
  private uiManager!: UiManager;

  constructor() {
    super('UiScene');
  }

  create(): void {
    this.add.image(SPELL_UI.X, SPELL_UI.Y, UI.SPELL_UI).setOrigin(0, 0.5);
    this.add.image(FIREBALL_ICON.X, FIREBALL_ICON.Y, UI.FIRE_BALL_ICON);
    this.add.image(BLINK_ICON.X, BLINK_ICON.Y, UI.BLINK_ICON);

    this.uiManager = new UiManager(this);
  }

  getUI(): UiManager {
    return this.uiManager;
  }
}
