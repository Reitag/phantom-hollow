import { Board, Handlers } from '@/base/ui/board';
import { AUDIO, UI } from '@/constants/asset-keys';
import { QUEST_LOG_WIDTH, MAIN_QUEST_TEXT, textStyle } from '@/constants/board-texts';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { QUEST_IDS } from '@/constants/quest-ids';
import { SCENE_SIZE } from '@/constants/scene-size';
import { QUEST_LOG_UI } from '@/constants/ui-coordinates';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export type QuestData = {
  title: string;
  name: string;
  description: string;
};

export type Logtext = {
  name: Phaser.GameObjects.Text;
  text: Phaser.GameObjects.Text;
};

export class QuestLog extends Board {
  private bg: Phaser.GameObjects.Image;
  private closeButton: Phaser.GameObjects.Image;

  private asides: Phaser.GameObjects.Image[] = [];
  private asideTexts: Phaser.GameObjects.Text[] = [];

  private questDataList: QuestData[] = [];
  private logTextDescription: Logtext | null = null;

  private contentContainer: Phaser.GameObjects.Container | null = null;

  private activeAsideGraphics: Phaser.GameObjects.Graphics | null = null;

  private currentActiveTitle: string = '';

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.board = this.scene.add
      .container(SCENE_SIZE.WIDTH / 2, SCENE_SIZE.HEIGHT / 2)
      .setVisible(false);

    this.bg = this.scene.add.image(0, 0, UI.QUEST_LOG_UI);
    this.board.add(this.bg);

    const closeBtnPos = this.alignCoords(
      this.bg,
      QUEST_LOG_UI.CLOSE_BTN.X,
      QUEST_LOG_UI.CLOSE_BTN.Y
    );

    this.closeButton = this.scene.add
      .image(closeBtnPos.x, closeBtnPos.y, UI.QUEST_LOG_CLOSE_BTN_UI)
      .setInteractive();

    this.board.add(this.closeButton);

    this.initLogContentText();

    // Quest
    if (SaveService.getQuestState(QUEST_IDS.MAIN_QUEST) !== 'done') {
      this.addQuestAside({
        title: this.mainQuestTitle,
        name: MAIN_QUEST_TEXT.NAME,
        description: MAIN_QUEST_TEXT.START_TEXT,
      });
    }
  }

  public toggleQuestLog(): void {
    if (!this.isOpen) {
      this.openBoard();
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_OPEN);
      this.registerQuestLogEvents();
      this.rebuildQuestAsides();

      if (this.questDataList.length > 0) {
        const activeIndex = this.questDataList.findIndex(
          (q) => q.title === this.currentActiveTitle
        );
        const targetIndex = activeIndex !== -1 ? activeIndex : 0;
        const currentQuest = this.questDataList[targetIndex];

        this.updateLogDisplay(currentQuest);
        this.highlightActiveAside(this.asides[targetIndex]);
      } else {
        this.clearLogDisplay('No active quests');
      }
    } else {
      this.closeBoard();
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_CLOSE);
      this.unregisterQuestLogEvents([this.closeButton]);
      this.clearQuestAsidesUI();
    }
  }

  public addQuestAside(quest: QuestData): void {
    this.questDataList.push(quest);

    if (this.isOpen) {
      this.createAsideUIElement(quest, this.asides.length);
    }
  }

  public removeQuestAside(title: string): void {
    const index = this.questDataList.findIndex((quest) => quest.title === title);
    if (index === -1) return;

    const isRemovingActive = this.questDataList[index].title === this.currentActiveTitle;

    this.questDataList.splice(index, 1);

    if (this.isOpen) {
      this.clearQuestAsidesUI();
      this.rebuildQuestAsides();

      if (isRemovingActive) {
        if (this.questDataList.length > 0) {
          this.updateLogDisplay(this.questDataList[0]);
        } else {
          this.clearLogDisplay('No active quests');
        }
      }
    } else if (isRemovingActive && this.questDataList.length > 0) {
      this.currentActiveTitle = this.questDataList[0].title;
    }
  }

  private rebuildQuestAsides(): void {
    this.questDataList.forEach((quest, index) => {
      this.createAsideUIElement(quest, index);
    });
  }

  private createAsideUIElement(quest: QuestData, index: number): void {
    const baseAsidePos = this.alignCoords(this.bg, QUEST_LOG_UI.ASIDE.X, QUEST_LOG_UI.ASIDE.Y);
    const yOffset = index * (54 + 8);

    const aside = this.scene.add
      .image(baseAsidePos.x, baseAsidePos.y + yOffset, UI.ASIDE_UI)
      .setInteractive();

    const titleText = this.scene.add.text(aside.x - 43, aside.y - 16, quest.title, {
      font: '14px EB Garamond',
      color: '#f0b427',
      wordWrap: {
        width: 90,
      },
    });

    this.bundleHandlers.set(aside, this.asideButtonEffect(aside, quest));

    this.asides.push(aside);
    this.asideTexts.push(titleText);
    this.board?.add([aside, titleText]);
  }

  private clearQuestAsidesUI(): void {
    this.unregisterQuestLogEvents(this.asides);

    this.asides.forEach((aside) => aside.destroy());
    this.asides = [];

    this.asideTexts.forEach((text) => text.destroy());
    this.asideTexts = [];
  }

  private asideButtonEffect(aside: Phaser.GameObjects.Image, quest: QuestData): Handlers {
    const pos = this.alignCoords(aside, aside.x, aside.y);
    const handlers = this.createButtonHandlers(aside, pos);

    handlers.onUp = () => {
      this.removeHoverEffect();
      this.updateLogDisplay(quest);

      this.highlightActiveAside(aside);
    };

    this.attachListeners(aside, handlers);
    return handlers;
  }

  private registerQuestLogEvents(): void {
    const pos = this.alignCoords(this.closeButton, this.closeButton.x, this.closeButton.y);
    const handlers = this.createButtonHandlers(this.closeButton, pos);

    handlers.onUp = () => {
      this.removeHoverEffect();
      this.toggleQuestLog();
    };

    this.bundleHandlers.set(this.closeButton, handlers);
    this.attachListeners(this.closeButton, handlers);
  }

  private unregisterQuestLogEvents(targets: Phaser.GameObjects.Image[]): void {
    targets.forEach((target) => {
      const handlers = this.bundleHandlers.get(target);
      if (!handlers) return;

      const events: [string, () => void][] = [
        ['pointerover', handlers.onOver],
        ['pointerout', handlers.onOut],
        ['pointerdown', handlers.onDown],
        ['pointerup', handlers.onUp],
      ];

      events.forEach(([event, handler]) => target.off(event, handler));
      this.bundleHandlers.delete(target);
    });
  }

  private createButtonHandlers(target: Phaser.GameObjects.Image, pos: Position): Handlers {
    const createEffect = (color: number, alpha: number, yOffset = 0) => {
      this.removeHoverEffect();
      this.hoverEffect = this.scene.add
        .graphics()
        .fillStyle(color, alpha)
        .fillRoundedRect(pos.x, pos.y + yOffset, target.width, target.height, 6);
      this.board?.add(this.hoverEffect);
    };

    return {
      onOver: () => createEffect(BUTTON_HOVERS.POINTEROVER.COLOR, BUTTON_HOVERS.POINTEROVER.ALPHA),
      onOut: () => this.removeHoverEffect(),
      onDown: () =>
        createEffect(BUTTON_HOVERS.POINTERDOWN.COLOR, BUTTON_HOVERS.POINTERDOWN.ALPHA, 1),
      onUp: () => {},
    };
  }

  private attachListeners(target: Phaser.GameObjects.Image, handlers: Handlers): void {
    target
      .on('pointerover', handlers.onOver)
      .on('pointerout', handlers.onOut)
      .on('pointerdown', handlers.onDown)
      .on('pointerup', handlers.onUp);
  }

  private initLogContentText(): void {
    this.contentContainer = this.scene.add.container(-255, -160);

    const name = this.scene.add.text(0, 0, '', {
      ...textStyle(QUEST_LOG_WIDTH).NAME,
    });

    const text = this.scene.add.text(0, 40, '', {
      ...textStyle(QUEST_LOG_WIDTH).TEXT,
    });

    this.logTextDescription = { name, text };
    this.contentContainer.add([name, text]);
    this.board?.add(this.contentContainer);
  }

  private highlightActiveAside(aside: Phaser.GameObjects.Image): void {
    this.removeActiveAsideHighlight();
    if (!aside) return;

    const pos = this.alignCoords(aside, aside.x, aside.y);

    this.activeAsideGraphics = this.scene.add
      .graphics()
      .fillStyle(BUTTON_HOVERS.POINTERDOWN.COLOR, BUTTON_HOVERS.POINTERDOWN.ALPHA)
      .fillRoundedRect(pos.x, pos.y, aside.width, aside.height, 6);

    this.board?.add(this.activeAsideGraphics);

    this.asideTexts.forEach((text) => this.board?.bringToTop(text));
  }

  private removeActiveAsideHighlight(): void {
    if (this.activeAsideGraphics) {
      this.activeAsideGraphics.destroy();
      this.activeAsideGraphics = null;
    }
  }

  private getActiveAsideElement(): Phaser.GameObjects.Image | undefined {
    const index = this.questDataList.findIndex((q) => q.title === this.currentActiveTitle);
    return this.asides[index];
  }

  private updateLogDisplay(quest: QuestData): void {
    this.currentActiveTitle = quest.name;
    if (this.logTextDescription) {
      this.logTextDescription.name.setText(quest.name);
      this.logTextDescription.text.setText(quest.description);
    }
  }

  private clearLogDisplay(message: string): void {
    this.currentActiveTitle = '';
    if (this.logTextDescription) {
      this.logTextDescription.name.setText('');
      this.logTextDescription.text.setText(message);
    }
  }
}
