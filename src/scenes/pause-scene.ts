import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';

export class PauseScene extends BaseScene {
  private resumeBtn: Phaser.GameObjects.Image | null = null;
  private menuBtn: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('PauseScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    // Pause all scenes
    if (this.scene.isActive('UiScene')) {
      this.scene.pause('UiScene');
    }
    this.scene.pause('LevelOneScene');
    this.sound.pauseAll();

    // Background
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // Title
    this.add
      .text(width / 2, height / 2 - 100, 'PAUSED', {
        font: 'bold 48px EB Garamond',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Resume
    this.resumeBtn = this.createButton(width / 2, height / 2, {
      key: UI.PAUSE_UI_RESUME_BTN,
      action: () => this.handleResume(),
    });

    // Menu
    this.menuBtn = this.createButton(width / 2, height / 2 + 43 /*gap = 20 and button size = 23*/, {
      key: UI.PAUSE_UI_MAIN_MENU_BTN,
      action: () => this.handleBackMainMenu(),
    });
  }

  private handleResume(): void {
    this.scene.resume('UiScene');
    this.scene.resume('LevelOneScene');
    this.sound.resumeAll();
    this.scene.stop();
  }

  private handleBackMainMenu(): void {
    this.scene.stop('LevelOneScene');
    this.scene.stop('UiScene');
    this.scene.start('MainMenuScene');
  }

  protected cleanup(): void {
    this.resumeBtn?.removeAllListeners();
    this.menuBtn?.removeAllListeners();

    this.resumeBtn?.destroy();
    this.menuBtn?.destroy();
  }
}
