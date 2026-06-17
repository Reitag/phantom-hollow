import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';

export class PauseScene extends BaseScene {
  constructor() {
    super('PauseScene');
  }

  public create(): void {
    super.create();

    const { width, height } = this.scale;

    if (this.scene.isActive('UiScene')) {
      this.scene.pause('UiScene');
    }
    this.scene.pause('LevelOneScene');
    this.sound.pauseAll();

    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // Title
    /*this.add
      .text(this.menuX, height / 2 - 80, 'PAUSED', {
        font: 'bold 48px EB Garamond',
        color: '#ffffff',
      })
      .setOrigin(0.5);*/

    let currentY = this.menuStartY;

    // Resume
    const resumeBtn = this.createButton(this.menuX, currentY, {
      key: UI.PAUSE_UI_RESUME_BTN,
      action: () => this.handleResume(),
    });
    this.buttons.push(resumeBtn);

    // Options
    currentY += this.buttonHeight + this.menuGap;
    const optionsBtn = this.createButton(this.menuX, currentY, {
      key: UI.MENU_UI_OPTION_BTN,
      action: () => {
        this.scene.sleep();
        this.scene.launch('OptionsScene', { showDeleteBtn: false, fromPause: true });
      },
    });
    this.buttons.push(optionsBtn);

    // Menu
    currentY += this.buttonHeight + this.menuGap;
    const menuBtn = this.createButton(this.menuX, currentY, {
      key: UI.PAUSE_UI_MAIN_MENU_BTN,
      action: () => this.handleBackMainMenu(),
    });
    this.buttons.push(menuBtn);
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
    super.cleanup();
  }
}
