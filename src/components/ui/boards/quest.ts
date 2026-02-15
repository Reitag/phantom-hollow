import { Board } from '@/base/ui/board';
import { UI } from '@/constants/asset-keys';
import { SCENE_SIZE } from '@/constants/scene-size';
import { QUEST_UI } from '@/constants/ui-coordinates';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { LevelOneScene } from '@/scenes/level-one-scene';

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
  private hoverEffect: Phaser.GameObjects.Graphics | null = null;
  private bundleHandlers = new Map<Phaser.GameObjects.Image, Handlers>();

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 4, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    this.bg = this.scene.add.image(0, 0, UI.QUEST_UI);
    this.board.add(this.bg);

    const conPos = this.alignCoords(this.bg, 20, 20);

    this.container = this.scene.add.container(conPos.x, conPos.y);
    this.board.add(this.container);

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
      .image(comBtnPos.x, comBtnPos.y, UI.QUEST_UI_ACCEPT_BTN)
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

  public registerQuestEvents(): boolean {
    if (!this.board) return false;

    if (!this.scene.events.listeners('open-quest').length) {
      this.scene.events.on('open-quest', this.openBoard, this);
      this.scene.events.on('close-quest', this.closeBoard, this);
    }

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

    this.scene.events.off('open-quest', this.openBoard, this);
    this.scene.events.off('close-quest', this.closeBoard, this);

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
    } else if (!inventory.canAdd(reward(), 1)) {
      sandbox.setText('The inventory is full');
    } else {
      inventory.addItem(reward(), 1);
      inventory.destroySlot(fangIndex);
      this.board?.destroy();
      this.board = null;
      (this.action as LevelOneScene).quest.destroy();
    }
  }

  private onAcceptedQuest(): void {
    this.buttons.delete(this.acceptButton);
    this.acceptButton.destroy();
    this.buttons.add(this.completeButton);
    this.completeButton.setVisible(true);
    (this.action as LevelOneScene).quest.changeMarkToCompleted();
  }

  private get action(): Phaser.Scene {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const scene = player.scene;

    return scene;
  }
}
