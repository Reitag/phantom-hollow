import Phaser from 'phaser';

import { UiManager } from '@/managers/ui-manager';
import { backgoundUi, fireBallIcon, blinkIcon } from '@/utils/coordinates';

export class UiScene extends Phaser.Scene {
  private uiManager!: UiManager;

  constructor() {
    super('UiScene');
  }

  create(): void {
    this.add.image(backgoundUi.x, backgoundUi.y, 'bg-ui').setOrigin(0, 0.5);
    this.add.image(fireBallIcon.x, fireBallIcon.y, 'fire-ball-icon');
    this.add.image(blinkIcon.x, blinkIcon.y, 'blink-icon');

    this.uiManager = new UiManager(this);
    //console.log(this.uiManager);
  }

  getUI(): UiManager {
    return this.uiManager;
  }
}
