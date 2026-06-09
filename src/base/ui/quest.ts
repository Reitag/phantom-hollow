import { Board } from '@/base/ui/board';
import { AUDIO, MISC, UI } from '@/constants/asset-keys';
import { QUEST_TEXT_WIDTH, textStyle } from '@/constants/board-texts';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { SCENE_SIZE } from '@/constants/scene-size';
import { QUEST_UI } from '@/constants/ui-coordinates';
import { QuestMark } from '@/entities/misc/quest-mark';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position, Rectangle } from '@/utils/types';

type Handlers = {
  onOver: () => void;
  onOut: () => void;
  onDown: () => void;
  onUp: () => void;
};

export abstract class Quest extends Board {
  protected bg: Phaser.GameObjects.Image;
  protected acceptButton: Phaser.GameObjects.Image;
  protected declineButton: Phaser.GameObjects.Image;
  protected completeButton: Phaser.GameObjects.Image;
  protected buttons: Set<Phaser.GameObjects.Image>;
  protected bundleHandlers = new Map<Phaser.GameObjects.Image, Handlers>();

  protected scrollContainer: Phaser.GameObjects.Container;
  protected scrollAreaHeight = 280;
  protected currentY = 0;
  protected scrollY = 0;
  protected maxScroll = 0;

  protected scrollThumb: Phaser.GameObjects.Graphics;
  protected scrollIndicatorCoords: Rectangle;

  protected questMark: QuestMark | null = null;

  constructor(scene: Phaser.Scene, questGiverName: string) {
    super(scene);

    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 4, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    this.bg = this.scene.add.image(0, 0, UI.QUEST_UI);
    this.bg.setInteractive();
    this.board.add(this.bg);

    const npcConCoord = this.alignCoords(this.bg, 0, 25);
    const npcNameContainer = this.scene.add
      .container(npcConCoord.x, npcConCoord.y)
      .add(this.scene.add.text(24, 0, questGiverName, textStyle(QUEST_TEXT_WIDTH).NAME));
    this.board.add(npcNameContainer);

    const conPos = this.alignCoords(this.bg, 25, 60);
    this.container = this.scene.add.container(conPos.x, conPos.y);
    this.board.add(this.container); // temp, checking functionality

    // scroll container
    this.scrollContainer = this.scene.add.container(0, 0);
    this.container.add(this.scrollContainer);

    // mask
    const maskShape = this.scene.add.graphics();
    this.container.add(maskShape);

    maskShape.fillRect(98, 165, 300, this.scrollAreaHeight);

    this.scrollContainer.setMask(maskShape.createGeometryMask());

    // scroll indicator
    this.scrollIndicatorCoords = {
      x: 146,
      y: -159,
      width: 7,
      height: 293.8,
    };

    // Left here just for possible future cases
    /*const { x, y, width, height } = this.scrollIndicatorCoords;*/

    this.scrollThumb = this.scene.add.graphics();
    this.board.add(this.scrollThumb);

    // Buttons
    const accBtnPos = this.alignCoords(this.bg, QUEST_UI.ACCEPT_BTN.X, QUEST_UI.ACCEPT_BTN.Y);
    const decBtnPos = this.alignCoords(this.bg, QUEST_UI.DECLINE_BTN.X, QUEST_UI.DECLINE_BTN.Y);
    const comBtnPos = this.alignCoords(this.bg, QUEST_UI.COMPLETE_BTN.X, QUEST_UI.COMPLETE_BTN.Y);

    this.acceptButton = this.scene.add
      .image(accBtnPos.x, accBtnPos.y, UI.QUEST_UI_ACCEPT_BTN)
      .setInteractive({ useHandCursor: true });
    this.declineButton = this.scene.add
      .image(decBtnPos.x, decBtnPos.y, UI.QUEST_UI_DECLINE_BTN)
      .setInteractive({ useHandCursor: true });
    this.completeButton = this.scene.add
      .image(comBtnPos.x, comBtnPos.y, UI.QUEST_UI_COMPLETE_BTN)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.board.add(this.acceptButton);
    this.board.add(this.declineButton);
    this.board.add(this.completeButton);

    // To delete on complition part of quest
    this.buttons = new Set<Phaser.GameObjects.Image>();

    this.buttons.add(this.acceptButton);
    this.buttons.add(this.declineButton);
  }

  public defineQuestState(questId: string): void {
    const state = SaveService.getQuestState(questId);

    switch (state) {
      case 'pending':
        break;

      case 'waiting':
        this.acceptQuest();
        this.questMark?.changeMarkToWaiting();
        break;

      case 'completed':
        this.onAcceptedQuest();
        this.questMark?.changeMarkToCompleted();
        break;

      case 'done':
        this.board?.destroy();
        this.board = null;
        this.questMark?.destroy();
        this.questMark = null;
        break;
    }
  }

  public createQuestMark(miscName: string): void {
    const result: Record<string, Position> = {};
    const scene = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer().scene;
    const map = ServiceLocator.resolve(ServiceKeys.map);
    const objectLayer = map.getObjectLayer('spawn-layer');
    if (!objectLayer) throw new Error('Spawn-layer does not resolved');

    for (const obj of objectLayer.objects) {
      if (obj.name !== 'misc-spawn') continue;

      const miscType = obj.properties.find(
        (p: { name: string; type: string; value: string }) => p.name === 'misc'
      )?.value;

      if (!miscType) continue;
      if (!obj.x || !obj.y) continue;
      result[miscType] = {
        x: obj.x,
        y: obj.y,
      };
    }

    this.questMark = new QuestMark({
      scene: scene,
      position: { x: result[miscName].x, y: result[miscName].y },
      keyName: MISC.QUEST_MARK,
      frame: 0,
    });
  }

  public registerQuestEvents(): boolean {
    if (!this.board) return false;
    if (!this.scene.events.listeners('open-quest').length) {
      this.scene.events.on('open-quest', this.openBoard, this);
      this.scene.events.on('close-quest', this.closeBoard, this);
    }

    this.bg.on('pointerover', this.bgOn, this);
    this.bg.on('pointerout', this.bgOff, this);

    this.buttons.forEach((button) => {
      const pos = this.alignCoords(button, button.x, button.y);

      const onOver = () => {
        this.hoverEffect = this.scene.add
          .graphics()
          .fillStyle(BUTTON_HOVERS.POINTEROVER.COLOR, BUTTON_HOVERS.POINTEROVER.ALPHA)
          .fillRoundedRect(pos.x, pos.y, button.width, button.height, 6);

        this.board?.add(this.hoverEffect);
      };

      const onOut = () => {
        this.removeHoverEffect();
      };

      const onDown = () => {
        this.removeHoverEffect();

        this.hoverEffect = this.scene.add.graphics();
        this.hoverEffect.fillStyle(
          BUTTON_HOVERS.POINTERDOWN.COLOR,
          BUTTON_HOVERS.POINTERDOWN.ALPHA
        );
        this.hoverEffect.fillRoundedRect(pos.x, pos.y + 1, button.width, button.height, 6);

        this.board?.add(this.hoverEffect);
      };

      const onUp = () => {
        if (button === this.acceptButton) {
          this.acceptQuest();
        } else if (button === this.completeButton) {
          this.completeQuest();
        }
        this.removeHoverEffect();
        this.closeBoard();
      };

      this.bundleHandlers.set(button, { onOver, onOut, onDown, onUp });

      button
        .on('pointerover', onOver)
        .on('pointerout', onOut)
        .on('pointerdown', onDown)
        .on('pointerup', onUp);
    });

    return true;
  }

  public unregisterQuestEvents() {
    if (!this.board) return;

    this.scrollY = 0;
    this.scrollContainer.y = 0;
    this.updateScrollIndicator();

    this.scene.events.off('open-quest', this.openBoard, this);
    this.scene.events.off('close-quest', this.closeBoard, this);

    this.bg.off('pointerover', this.bgOn, this);
    this.bg.off('pointerout', this.bgOff, this);

    this.buttons.forEach((button) => {
      const handlers = this.bundleHandlers.get(button);
      if (!handlers) return;

      button
        .off('pointerover', handlers.onOver)
        .off('pointerout', handlers.onOut)
        .off('pointerdown', handlers.onDown)
        .off('pointerup', handlers.onUp);

      this.bundleHandlers.delete(button);
    });
  }

  protected abstract acceptQuest(): void;
  protected abstract onAcceptedQuest(): void;
  protected abstract completeQuest(): void;

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

  protected addBlock(block: Phaser.GameObjects.Text | Phaser.GameObjects.Image, spacing = 10) {
    block.y = this.currentY;
    this.currentY += block.height + spacing;
    this.scrollContainer.add(block);
  }

  protected updateScrollIndicator() {
    this.scrollThumb.clear();

    if (this.maxScroll <= 0) {
      this.scrollThumb.setVisible(false);
      return;
    }

    this.scrollThumb.setVisible(true);

    const visibleRatio = this.scrollAreaHeight / (this.scrollAreaHeight + this.maxScroll);

    const thumbHeight = this.scrollAreaHeight * visibleRatio;

    const scrollProgress = -this.scrollY / this.maxScroll;

    const thumbY =
      this.scrollIndicatorCoords.y +
      scrollProgress * (this.scrollIndicatorCoords.height - thumbHeight);

    this.scrollThumb.fillStyle(0xfce2bd, 0.8);
    this.scrollThumb.fillRoundedRect(
      this.scrollIndicatorCoords.x,
      thumbY,
      this.scrollIndicatorCoords.width,
      thumbHeight,
      2
    );
  }

  private bgOn(): void {
    this.scene.input.on('wheel', this.handleScroll, this);
  }

  private bgOff(): void {
    this.scene.input.off('wheel', this.handleScroll, this);
  }

  private handleScroll(
    pointer: Phaser.Input.Pointer,
    currentlyOver: Phaser.GameObjects.GameObject[],
    deltaX: number,
    deltaY: number
  ) {
    this.scrollY -= deltaY * 0.2;
    this.scrollY = Phaser.Math.Clamp(this.scrollY, -this.maxScroll, 0);
    this.scrollContainer.y = this.scrollY;
    this.updateScrollIndicator();
  }

  protected openBoard(): void {
    super.openBoard();
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_OPEN);
  }

  protected closeBoard(): void {
    super.closeBoard();
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_CLOSE);
  }

  protected get action(): Phaser.Scene {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const scene = player.scene;

    return scene;
  }
}
