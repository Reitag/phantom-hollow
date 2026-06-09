import { Board } from '@/base/ui/board';
import { AUDIO, UI } from '@/constants/asset-keys';
import {
  GREETING_LETTER_TEXT,
  LETTER_TEXT_WIDTH,
  MAIN_QUEST_TEXT,
  textStyle,
} from '@/constants/board-texts';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { QUEST_IDS } from '@/constants/quest-ids';
import { SCENE_SIZE } from '@/constants/scene-size';
import { LETTER_UI } from '@/constants/ui-coordinates';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { QuestLog } from './quest-log';

interface AdvancedBoardConfig {
  title: string;
  content: string;
  closeButtonTexture: string;
  eventName: string;
}

abstract class AdvancedBoard extends Board {
  protected bg: Phaser.GameObjects.Image;
  protected closeButton: Phaser.GameObjects.Image;

  private currentY = 0;

  protected title: string;
  protected content: string;
  protected closeButtonTexture: string;
  protected eventName: string;

  constructor(scene: Phaser.Scene, config: AdvancedBoardConfig) {
    super(scene);

    this.title = config.title;
    this.content = config.content;
    this.closeButtonTexture = config.closeButtonTexture;
    this.eventName = config.eventName;

    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 2, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    this.bg = this.scene.add.image(0, 0, UI.LETTER_UI);
    this.board.add(this.bg);

    const titleCoord = this.alignCoords(this.bg, 0, 25);

    const titleContainer = this.scene.add
      .container(titleCoord.x, titleCoord.y)
      .add(this.scene.add.text(24, 0, this.title, textStyle(LETTER_TEXT_WIDTH).NAME));

    this.board.add(titleContainer);

    const conPos = this.alignCoords(this.bg, 25, 60);
    this.container = this.scene.add.container(conPos.x, conPos.y);
    this.board.add(this.container);

    const bodyText = this.createText(this.content, textStyle(LETTER_TEXT_WIDTH).TEXT);

    this.addBlock(bodyText);

    const closeBtnPos = this.alignCoords(this.bg, LETTER_UI.CLOSE_BTN.X, LETTER_UI.CLOSE_BTN.Y);

    this.closeButton = this.scene.add
      .image(closeBtnPos.x, closeBtnPos.y, this.closeButtonTexture)
      .setInteractive({ useHandCursor: true });

    this.board.add(this.closeButton);
  }

  public registerEvents(): boolean {
    if (!this.board) return false;

    if (!this.scene.events.listeners(`open-${this.eventName}`).length) {
      this.scene.events.on(`open-${this.eventName}`, this.openBoard, this);
      this.scene.events.on(`close-${this.eventName}`, this.closeBoard, this);
    }

    const pos = this.alignCoords(this.closeButton, this.closeButton.x, this.closeButton.y);

    const onOver = () => {
      this.hoverEffect = this.scene.add
        .graphics()
        .fillStyle(BUTTON_HOVERS.POINTEROVER.COLOR, BUTTON_HOVERS.POINTEROVER.ALPHA)
        .fillRoundedRect(pos.x, pos.y, this.closeButton.width, this.closeButton.height, 6);

      this.board?.add(this.hoverEffect);
    };

    const onOut = () => {
      this.removeHoverEffect();
    };

    const onDown = () => {
      this.removeHoverEffect();

      this.hoverEffect = this.scene.add.graphics();
      this.hoverEffect.fillStyle(BUTTON_HOVERS.POINTERDOWN.COLOR, BUTTON_HOVERS.POINTERDOWN.ALPHA);

      this.hoverEffect.fillRoundedRect(
        pos.x,
        pos.y + 1,
        this.closeButton.width,
        this.closeButton.height,
        6
      );

      this.board?.add(this.hoverEffect);
    };

    const onUp = () => {
      this.removeHoverEffect();
      this.closeBoard();
      this.onButtonPress();
    };

    this.bundleHandlers.set(this.closeButton, {
      onOver,
      onOut,
      onDown,
      onUp,
    });

    this.closeButton
      .on('pointerover', onOver)
      .on('pointerout', onOut)
      .on('pointerdown', onDown)
      .on('pointerup', onUp);

    return true;
  }

  public unregisterEvents(): void {
    if (!this.board) return;

    this.scene.events.off(`open-${this.eventName}`, this.openBoard, this);
    this.scene.events.off(`close-${this.eventName}`, this.closeBoard, this);

    const handlers = this.bundleHandlers.get(this.closeButton);
    if (!handlers) return;

    this.closeButton
      .off('pointerover', handlers.onOver)
      .off('pointerout', handlers.onOut)
      .off('pointerdown', handlers.onDown)
      .off('pointerup', handlers.onUp);

    this.bundleHandlers.delete(this.closeButton);
  }

  protected onButtonPress(): void {}

  protected openBoard(): void {
    super.openBoard();
    if (this.board) {
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_OPEN);
    }
  }

  protected closeBoard(): void {
    super.closeBoard();
    if (this.board) {
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_CLOSE);
    }
  }

  protected addBlock(block: Phaser.GameObjects.Text | Phaser.GameObjects.Image, spacing = 10) {
    block.y = this.currentY;
    this.currentY += block.height + spacing;
    this.container?.add(block);
  }

  protected createText(
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

export const BOARD_EVENT_NAMES = {
  LETTER: 'letter',
  MAIN_QUEST: 'main-quest',
} as const;

export class Letter extends AdvancedBoard {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      title: GREETING_LETTER_TEXT.NAME,
      content: GREETING_LETTER_TEXT.TEXT,
      closeButtonTexture: UI.LETTER_UI_CLOSE_BTN,
      eventName: BOARD_EVENT_NAMES.LETTER,
    });
  }
}

export class MainQuest extends AdvancedBoard {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      title: MAIN_QUEST_TEXT.NAME,
      content: MAIN_QUEST_TEXT.END_TEXT,
      closeButtonTexture: UI.QUEST_UI_COMPLETE_BTN,
      eventName: BOARD_EVENT_NAMES.MAIN_QUEST,
    });
  }

  protected override onButtonPress(): void {
    SaveService.setQuestState(QUEST_IDS.MAIN_QUEST, 'done');
    ServiceLocator.resolve(ServiceKeys.ui)
      .getBoard<QuestLog>('quest-log')
      .removeQuestAside('The Last Stand for Embercrest');

    this.board?.destroy();
    this.board = null;
  }
}
