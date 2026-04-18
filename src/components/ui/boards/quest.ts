import { Board } from '@/base/ui/board';
import { AUDIO, UI } from '@/constants/asset-keys';
import { ALCHEMIST_QUEST_TEXT, QUEST_TEXT_WIDTH, textStyle } from '@/constants/board-texts';
import { QUEST_IDS } from '@/constants/quest-ids';
import { SCENE_SIZE } from '@/constants/scene-size';
import { QUEST_UI } from '@/constants/ui-coordinates';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { LevelOneScene } from '@/scenes/level-one-scene';
import { Rectangle } from '@/utils/types';

type Handlers = {
  onOver: () => void;
  onOut: () => void;
  onDown: () => void;
  onUp: () => void;
};

export class Quest extends Board {
  private bg: Phaser.GameObjects.Image;
  private acceptButton: Phaser.GameObjects.Image;
  private declineButton: Phaser.GameObjects.Image;
  private completeButton: Phaser.GameObjects.Image;
  private buttons: Set<Phaser.GameObjects.Image>;
  private bundleHandlers = new Map<Phaser.GameObjects.Image, Handlers>();

  private scrollContainer: Phaser.GameObjects.Container;
  private scrollAreaHeight = 280;
  private currentY = 0;
  private scrollY = 0;
  private maxScroll = 0;

  //private scrollTrack: Phaser.GameObjects.Graphics;
  private scrollThumb: Phaser.GameObjects.Graphics;
  private scrollIndicatorCoords: Rectangle;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 4, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    this.bg = this.scene.add.image(0, 0, UI.QUEST_UI);
    this.bg.setInteractive();
    this.board.add(this.bg);

    const npcConCoord = this.alignCoords(this.bg, 0, 25);
    const npcNameContainer = this.scene.add
      .container(npcConCoord.x, npcConCoord.y)
      .add(this.scene.add.text(24, 0, ALCHEMIST_QUEST_TEXT.NAME, textStyle(QUEST_TEXT_WIDTH).NAME));
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

    //this.scrollTrack = this.scene.add.graphics();

    const { x, y, width, height } = this.scrollIndicatorCoords;

    //this.scrollTrack.fillStyle(0x2a1d12, 1);
    //this.scrollTrack.fillRoundedRect(x, y, width, height, 2);

    this.scrollThumb = this.scene.add.graphics();

    //this.board.add(this.scrollTrack);
    this.board.add(this.scrollThumb);

    // init content
    const questTitle = this.createText(
      ALCHEMIST_QUEST_TEXT.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const questText = this.createText(
      ALCHEMIST_QUEST_TEXT.PENDING,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    const questObjectivesTitle = this.createText(
      ALCHEMIST_QUEST_TEXT.OBJECTIVES.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const questObjectives = this.createText(
      ALCHEMIST_QUEST_TEXT.OBJECTIVES.TEXT,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    const questRewardTitle = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const rewardImage = this.scene.add
      .image(0, this.currentY, UI.HASTE_POTION_ICON)
      .setOrigin(0, 0);

    const rewardItemTitle = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.ITEM.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TEXT,
      { color: textStyle(QUEST_TEXT_WIDTH).REWARD_TITLE.color }
    );

    const rewardItemDesc = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.ITEM.DESCRIPTION,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    this.addBlock(questTitle);
    this.addBlock(questText);
    this.addBlock(questObjectivesTitle);
    this.addBlock(questObjectives);
    this.addBlock(questRewardTitle);
    this.addBlock(rewardImage);
    this.addBlock(rewardItemTitle);
    this.addBlock(rewardItemDesc);

    // recalculate scroll bounds
    this.maxScroll = Math.max(0, this.currentY - this.scrollAreaHeight);
    this.updateScrollIndicator();

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

  public defineQuestState(): void {
    const state = SaveService.getQuestState(QUEST_IDS.ALCHEMIST_FIREWORM);

    switch (state) {
      case 'pending':
        break;

      case 'waiting':
        this.acceptQuest();
        break;

      case 'completed':
        this.onAcceptedQuest();
        break;

      case 'done':
        this.board?.destroy();
        this.board = null;
        (this.action as LevelOneScene).quest.destroy();
        break;
    }
  }

  public registerQuestEvents(): boolean {
    if (!this.board) return false;
    /*this.scene.events.listeners('open-quest').forEach((e) => {
      console.log(e);
    });*/
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
          .fillStyle(0xfce2bd, 0.2)
          .fillRoundedRect(pos.x, pos.y, button.width, button.height, 6);

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
        button.setTint(0x88ff88);
      };

      const onUp = () => {
        if (button === this.acceptButton) {
          this.acceptQuest();
        } else if (button === this.completeButton) {
          this.completeQuest();
        }
        button.clearTint();
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

  // Open and close quest frame, inherited from base class
  protected openBoard(): void {
    super.openBoard();
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_OPEN);
  }

  protected closeBoard(): void {
    super.closeBoard();
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.PAPER_CLOSE);
  }

  private acceptQuest(): void {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();

    if (player.isOnQuest === false && !this.action.events.listeners('fire-worm:died').length) {
      player.isOnQuest = true;
      this.action.events.once(
        'fire-worm:died',
        (this.action as LevelOneScene).onFireWormDied,
        this.action
      );
      this.action.events.once('fireworm-fang:looted', this.onAcceptedQuest, this);
      (this.action as LevelOneScene).quest.changeMarkToWaiting();

      SaveService.setQuestState(QUEST_IDS.ALCHEMIST_FIREWORM, 'waiting');
    }
  }

  private completeQuest(): void {
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    const reward = LOOT_FACTORY['haste-potion'];
    const fang = LOOT_FACTORY['fireworm-fang'];
    const fangIndex = inventory.getItemIndex(fang().id);

    if (fangIndex === undefined) {
      sandbox.setText('Quest item has not been found');
    } else {
      inventory.destroySlot(fangIndex);
      inventory.addItem(reward(), 1);
      this.unregisterQuestEvents();
      this.board?.destroy();
      this.board = null;
      (this.action as LevelOneScene).quest.destroy();

      SaveService.setQuestState(QUEST_IDS.ALCHEMIST_FIREWORM, 'done');
    }
  }

  private onAcceptedQuest(): void {
    // accept button
    this.buttons.delete(this.acceptButton);
    this.acceptButton.destroy();

    // decline button
    this.buttons.delete(this.declineButton);
    this.declineButton.destroy();

    // change text
    this.scrollContainer.getAll().forEach((elem, index) => {
      if (index !== 0) {
        elem.destroy();
      }
    });
    this.currentY = 30;

    const completedText = this.createText(
      ALCHEMIST_QUEST_TEXT.COMPLETED,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    // quest reward
    const questRewardTitle = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const rewardText = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.COMPLETED_TEXT,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    const rewardImage = this.scene.add
      .image(0, this.currentY, UI.HASTE_POTION_ICON)
      .setOrigin(0, 0);

    const rewardItemTitle = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.ITEM.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TEXT,
      { color: textStyle(QUEST_TEXT_WIDTH).REWARD_TITLE.color }
    );

    const rewardItemDesc = this.createText(
      ALCHEMIST_QUEST_TEXT.REWARD.ITEM.DESCRIPTION,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    this.addBlock(completedText);
    this.addBlock(questRewardTitle);
    this.addBlock(rewardText);
    this.addBlock(rewardImage);
    this.addBlock(rewardItemTitle);
    this.addBlock(rewardItemDesc);

    this.maxScroll = Math.max(0, this.currentY - this.scrollAreaHeight);
    this.updateScrollIndicator();

    this.buttons.add(this.completeButton);
    this.completeButton.setVisible(true);
    (this.action as LevelOneScene).quest.changeMarkToCompleted();

    SaveService.setQuestState(QUEST_IDS.ALCHEMIST_FIREWORM, 'completed');
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

  private addBlock(block: Phaser.GameObjects.Text | Phaser.GameObjects.Image, spacing = 10) {
    block.y = this.currentY;
    this.currentY += block.height + spacing;
    this.scrollContainer.add(block);
  }

  private updateScrollIndicator() {
    this.scrollThumb.clear();

    if (this.maxScroll <= 0) {
      //this.scrollTrack.setVisible(false);
      this.scrollThumb.setVisible(false);
      return;
    }

    //this.scrollTrack.setVisible(true);
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

  private get action(): Phaser.Scene {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const scene = player.scene;

    return scene;
  }
}
