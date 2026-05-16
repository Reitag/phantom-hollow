import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { OUTRO_TEXT } from '@/constants/board-texts';

export class OutroScene extends BaseScene {
  private storyText: Phaser.GameObjects.Text | null = null;
  private menuBtn: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('OutroScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000000');

    this.storyText = this.add
      .text(width / 2, height / 2, OUTRO_TEXT.TEXT, {
        fontSize: '22px',
        fontFamily: 'Volkhov',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#000000', 4);

    this.menuBtn = this.createButton(width / 2, height - 40, {
      key: UI.PAUSE_UI_MAIN_MENU_BTN,
      action: () => this.enterToMainMenu(),
    });
  }

  private enterToMainMenu(): void {
    this.scene.start('MainMenuScene');
  }

  protected cleanup(): void {
    this.storyText?.destroy();
    this.storyText = null;
    this.menuBtn?.removeAllListeners();
    this.menuBtn?.destroy();
    this.menuBtn = null;
  }
}
