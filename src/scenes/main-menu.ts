import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';

export class MainMenuScene extends BaseScene {
  private menuButtons: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#000000');

    const save = SaveService.load();
    const hasSave = SaveService.hasSave();

    const centerX = this.scale.width / 2;
    const startY = 400;
    const gap = 20;

    const buttons = [
      {
        key: UI.MENU_UI_CONTINUE_BTN,
        action: () => {
          if (!save) return;
          this.scene.start(save.scene, save);
        },
        visible: hasSave,
      },
      {
        key: UI.MENU_UI_START_BTN,
        action: () => {
          if (hasSave) SaveService.clear(true);
          this.scene.start('IntroScene');
        },
        visible: true,
      },
    ];

    buttons.forEach((btn, index) => {
      if (!btn.visible) return;

      const y = startY + index * (23 + gap); // 23 size of button

      const button = this.createButton(centerX, y, {
        key: btn.key,
        action: btn.action,
      });

      this.menuButtons.push(button);
    });

    const footerY = this.scale.height - 28;

    // Version
    this.add
      .text(28, footerY, `v${this.game.config.gameVersion}`, {
        fontFamily: 'Volkhov',
        fontSize: '13px',
        color: '#6f6f6f',
      })
      .setOrigin(0, 1);

    // Credits
    const creditsText =
      `Design & Code - Ilya Chernov\n` + `Narrative - Artem Sedov\n` + `Art - Darya "InkMoon"`;

    this.add
      .text(this.scale.width / 2, footerY, creditsText, {
        fontFamily: 'Volkhov',
        fontSize: '13px',
        color: '#6f6f6f',
        align: 'center',
        lineSpacing: 3,
      })
      .setOrigin(0.5, 1);
  }

  protected cleanup(): void {
    this.menuButtons.forEach((button) => button.destroy());
    this.menuButtons = [];
  }
}
