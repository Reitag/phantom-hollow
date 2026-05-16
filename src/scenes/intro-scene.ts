import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { INTRO_TEXT } from '@/constants/board-texts';

export class IntroScene extends BaseScene {
  private storyText: Phaser.GameObjects.Text | null = null;
  private continueButton: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('IntroScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000000');

    this.storyText = this.add
      .text(width / 2, height + 200, INTRO_TEXT.TEXT, {
        fontSize: '22px',
        fontFamily: 'Volkhov',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#000000', 4);

    // Infinite scroll
    this.tweens.add({
      targets: this.storyText,
      y: -this.storyText.height,
      duration: 110000,
      ease: 'Linear',
    });

    // Continue Button
    this.continueButton = this.createButton(width / 2, height - 40, {
      key: UI.MENU_UI_CONTINUE_BTN,
      action: () => this.startGame(),
    });

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private startGame(): void {
    this.cameras.main.fadeOut(800, 0, 0, 0);

    this.time.delayedCall(800, () => {
      this.scene.start('StartGameScene');
    });
  }

  protected cleanup(): void {
    this.continueButton?.removeAllListeners();
    this.continueButton?.destroy();
    this.continueButton = null;
    this.storyText?.destroy();
    this.storyText = null;
  }
}
