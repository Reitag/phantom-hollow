import { Board } from '@/base/ui/board';
import { AUDIO, UI } from '@/constants/asset-keys';
import { GREETING_LETTER_TEXT, LETTER_TEXT_WIDTH, textStyle } from '@/constants/board-texts';
import { SCENE_SIZE } from '@/constants/scene-size';
import { LETTER_UI } from '@/constants/ui-coordinates';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

type Handlers = {
  onOver: () => void;
  onOut: () => void;
  onDown: () => void;
  onUp: () => void;
};

export class Letter extends Board {
  private bg: Phaser.GameObjects.Image;
  private closeButton: Phaser.GameObjects.Image;
  private bundleHandlers = new Map<Phaser.GameObjects.Image, Handlers>();

  private currentY = 0;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 2, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    this.bg = this.scene.add.image(0, 0, UI.LETTER_UI);
    this.board.add(this.bg);

    const titleCoord = this.alignCoords(this.bg, 0, 25);
    const titleContainer = this.scene.add
      .container(titleCoord.x, titleCoord.y)
      .add(
        this.scene.add.text(24, 0, GREETING_LETTER_TEXT.NAME, textStyle(LETTER_TEXT_WIDTH).NAME)
      );
    this.board.add(titleContainer);

    const conPos = this.alignCoords(this.bg, 25, 60);
    this.container = this.scene.add.container(conPos.x, conPos.y);
    this.board.add(this.container);

    // Text
    // (Remove Letter title because it was unnessasery)
    /*const letterTitle = this.createText(
      GREETING_LETTER_TEXT.TITLE,
      textStyle(LETTER_TEXT_WIDTH).TITLE
    );*/
    const letterText = this.createText(
      GREETING_LETTER_TEXT.TEXT,
      textStyle(LETTER_TEXT_WIDTH).TEXT
    );

    //this.addBlock(letterTitle);
    this.addBlock(letterText);

    // Close button
    const closeBtnPos = this.alignCoords(this.bg, LETTER_UI.CLOSE_BTN.X, LETTER_UI.CLOSE_BTN.Y);

    this.closeButton = this.scene.add
      .image(closeBtnPos.x, closeBtnPos.y, UI.LETTER_UI_CLOSE_BTN)
      .setInteractive({ useHandCursor: true });

    this.board.add(this.closeButton);
  }

  public registerLetterEvents(): boolean {
    if (!this.board) return false;

    if (!this.scene.events.listeners('open-letter').length) {
      this.scene.events.on('open-letter', this.openBoard, this);
      this.scene.events.on('close-letter', this.closeBoard, this);
    }

    const pos = this.alignCoords(this.closeButton, this.closeButton.x, this.closeButton.y);

    const onOver = () => {
      this.hoverEffect = this.scene.add
        .graphics()
        .fillStyle(0xfce2bd, 0.2)
        .fillRoundedRect(pos.x, pos.y, this.closeButton.width, this.closeButton.height, 6);

      this.board?.add(this.hoverEffect);
    };

    const onOut = () => {
      if (this.hoverEffect) {
        this.board?.remove(this.hoverEffect);
        this.hoverEffect.destroy();
        this.hoverEffect = null;
      }
    };

    const onDown = () => {
      this.closeButton.setTint(0x88ff88);
    };

    const onUp = () => {
      this.closeButton.clearTint();
      this.closeBoard();
    };

    this.bundleHandlers.set(this.closeButton, { onOver, onOut, onDown, onUp });

    this.closeButton
      .on('pointerover', onOver)
      .on('pointerout', onOut)
      .on('pointerdown', onDown)
      .on('pointerup', onUp);

    return true;
  }

  public unregisterLetterEvents() {
    if (!this.board) return;

    this.scene.events.off('open-letter', this.openBoard, this);
    this.scene.events.off('close-letter', this.closeBoard, this);

    const handlers = this.bundleHandlers.get(this.closeButton);
    if (!handlers) return;

    this.closeButton
      .off('pointerover', handlers.onOver)
      .off('pointerout', handlers.onOut)
      .off('pointerdown', handlers.onDown)
      .off('pointerup', handlers.onUp);

    this.bundleHandlers.delete(this.closeButton);
  }

  // Inherited from base class
  protected openBoard(): void {
    super.openBoard();
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_OPEN);
  }

  protected closeBoard(): void {
    super.closeBoard();
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_CLOSE);
  }

  private addBlock(block: Phaser.GameObjects.Text | Phaser.GameObjects.Image, spacing = 10) {
    block.y = this.currentY;
    this.currentY += block.height + spacing;
    this.container?.add(block);
  }

  private createText(
    content: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    extra?: Partial<Phaser.Types.GameObjects.Text.TextStyle>
  ) {
    return this.scene.add.text(0, this.currentY, content, {
      ...style,
      ...extra,
    });
  }
}
