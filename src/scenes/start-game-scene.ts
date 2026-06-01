import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { BOARD_TEXT_WIDTH, boardText, START_GAME_TEXT } from '@/constants/board-texts';

export class StartGameScene extends BaseScene {
  private container: Phaser.GameObjects.Container | null = null;
  private backGround: Phaser.GameObjects.Shape | null = null;
  private acceptBtn: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('StartGameScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    /*this.backGround = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.7)
      .setOrigin(0)
      .setInteractive();*/

    const startY = 40;

    this.container = this.add.container(width / 2, 60);

    const style = boardText(BOARD_TEXT_WIDTH);

    const nameText = this.add
      .text(0, startY, START_GAME_TEXT.NAME, {
        ...style.NAME,
      })
      .setOrigin(0.5, 0);

    const line = this.add.graphics();
    line.lineStyle(2, 0xffffff);
    line.lineBetween(-150, 20, 150, 20);

    const messageText = this.add
      .text(0, startY + 60, START_GAME_TEXT.TEXT, {
        ...style.TEXT,
      })
      .setOrigin(0.5, 0);
    const textBounds = messageText.getBounds(); // New here

    // Panel
    const paddingY = 60;
    const paddingX = 40;

    const panelWidth = 650;
    const panelHeight = textBounds.height + paddingY * 2 + 80;

    const panel = this.add.graphics();

    panel.fillStyle(0x000000); // dark background
    panel.fillRoundedRect(-panelWidth / 2, 0, panelWidth, panelHeight, 16);

    panel.lineStyle(2, 0xffffff, 0.6); // border
    panel.strokeRoundedRect(-panelWidth / 2, 0, panelWidth, panelHeight, 16);

    //this.container.setY(this.scale.height / 2 - panelHeight / 2);

    // Button
    this.acceptBtn = this.createButton(width / 2, height - 160, {
      key: UI.MISC_UI_OK_BTN,
      action: () => this.handleAccept(),
    });

    // Button did not add here
    this.container.add([panel, nameText, line, messageText]);

    //this.events.once(Phaser.Scenes.Events.CREATE, this.createLevelOneScene, this);
  }

  private createLevelOneScene(): void {
    this.scene.launch('LevelOneScene', {});

    const levelOne = this.scene.get('LevelOneScene');
    levelOne.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.scene.pause('LevelOneScene');
    });

    this.scene.manager.scenes.forEach((scene) => {
      if (scene.sys.settings.key === 'UiScene') {
        this.setupUiPause(scene);
      }
    });
  }

  private setupUiPause(uiScene: Phaser.Scene): void {
    uiScene.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.scene.pause('UiScene');
      this.scene.bringToTop('StartGameScene');
    });
  }

  private handleAccept(): void {
    /*this.scene.resume('LevelOneScene');
    if (this.scene.get('UiScene')) {
      this.scene.resume('UiScene');
    }*/

    this.scene.stop();
  }

  protected cleanup(): void {
    /*this.backGround?.destroy();
    this.backGround = null;*/
    this.container?.destroy();
    this.container = null;
    this.acceptBtn?.removeAllListeners();
    this.acceptBtn?.destroy();
  }
}
