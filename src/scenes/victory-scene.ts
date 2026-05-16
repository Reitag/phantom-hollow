import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { BOARD_TEXT_WIDTH, boardText, END_GAME_TEXT } from '@/constants/board-texts';

export class VictoryScene extends BaseScene {
  private container: Phaser.GameObjects.Container | null = null;
  private backGround: Phaser.GameObjects.Shape | null = null;
  private continueBtn: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('VictoryScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.scene.pause('LevelOneScene');
    this.scene.pause('UiScene');

    this.backGround = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.7)
      .setOrigin(0)
      .setInteractive();

    this.container = this.add.container(width / 2, height / 4);

    const style = boardText(BOARD_TEXT_WIDTH);

    const title = this.add
      .text(0, 0, END_GAME_TEXT.NAME, {
        ...style.NAME,
      })
      .setOrigin(0.5);

    const line = this.add.graphics();
    line.lineStyle(2, 0xffffff);
    line.lineBetween(-150, 20, 150, 20);

    const message = this.add
      .text(0, 40, END_GAME_TEXT.TEXT, {
        ...style.TEXT,
      })
      .setOrigin(0.5);

    this.continueBtn = this.createButton(width / 2, height * 0.8, {
      key: UI.MISC_UI_OK_BTN,
      action: () => this.handleContinue(),
    });

    this.container.add([title, line, message]);
  }

  private handleContinue(): void {
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      this.scene.stop('LevelOneScene');
      this.scene.stop('UiScene');
      //this.scene.stop();
      this.scene.start('OutroScene');
    });
  }

  protected cleanup(): void {
    this.backGround?.destroy();
    this.backGround = null;
    this.container?.destroy();
    this.container = null;
    this.continueBtn?.removeAllListeners();
    this.continueBtn?.destroy();
    this.continueBtn = null;
  }
}
