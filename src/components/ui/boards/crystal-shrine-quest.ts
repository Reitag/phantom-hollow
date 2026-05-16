import { Quest } from '@/base/ui/quest';
import { UI } from '@/constants/asset-keys';
import { CRYSTAL_SHRINE_QUEST_TEXT, QUEST_TEXT_WIDTH, textStyle } from '@/constants/board-texts';
import { QUEST_IDS } from '@/constants/quest-ids';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { LevelOneScene } from '@/scenes/level-one-scene';

export class CrystalShrineQuest extends Quest {
  private crystalsLooted = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, CRYSTAL_SHRINE_QUEST_TEXT.NAME);

    // init content
    const questTitle = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const questText = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.PENDING,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    const questObjectivesTitle = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.OBJECTIVES.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const questObjectives = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.OBJECTIVES.TEXT,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    const questRewardTitle = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const rewardImage = this.scene.add
      .image(0, this.currentY, UI.STONE_OF_CONCENTRATION_ICON)
      .setOrigin(0, 0);

    const rewardItemTitle = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.ITEM.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TEXT,
      { color: textStyle(QUEST_TEXT_WIDTH).REWARD_TITLE.color }
    );

    const rewardItemDesc = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.ITEM.DESCRIPTION,
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
  }

  public pickingCrystal(): void {
    this.crystalsLooted++;

    if (this.crystalsLooted === 3) {
      const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
      player.setQuestStatus(QUEST_IDS.CRYSTAL, false);
      this.action.events.emit('crystal-shrine:completed');
      this.questMark?.changeMarkToCompleted();
    }
  }

  protected acceptQuest(): void {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();

    if (player.isQuestActive(QUEST_IDS.CRYSTAL) === false) {
      player.setQuestStatus(QUEST_IDS.CRYSTAL, true);

      (this.action as LevelOneScene).onCrystalShrineQuestStart();
      SaveService.setQuestState(QUEST_IDS.CRYSTAL, 'waiting');
    }

    this.action.events.on('crystal-shrine:looted', this.pickingCrystal, this);
    this.action.events.once('crystal-shrine:completed', this.onAcceptedQuest, this);
    this.questMark?.changeMarkToWaiting();
  }

  protected onAcceptedQuest(): void {
    if (!this.action.events.listeners('crystal-shrine:looted').length) {
      this.action.events.on('crystal-shrine:looted', this.pickingCrystal, this);
    }
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
      CRYSTAL_SHRINE_QUEST_TEXT.COMPLETED,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    // quest reward
    const questRewardTitle = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TITLE
    );

    const rewardText = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.COMPLETED_TEXT,
      textStyle(QUEST_TEXT_WIDTH).TEXT
    );

    const rewardImage = this.scene.add
      .image(0, this.currentY, UI.STONE_OF_CONCENTRATION_ICON)
      .setOrigin(0, 0);

    const rewardItemTitle = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.ITEM.TITLE,
      textStyle(QUEST_TEXT_WIDTH).TEXT,
      { color: textStyle(QUEST_TEXT_WIDTH).REWARD_TITLE.color }
    );

    const rewardItemDesc = this.createText(
      CRYSTAL_SHRINE_QUEST_TEXT.REWARD.ITEM.DESCRIPTION,
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
    // For quest mark see in pickingCrystal();

    SaveService.setQuestState(QUEST_IDS.CRYSTAL, 'completed');
  }

  protected completeQuest(): void {
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    const reward = LOOT_FACTORY['stone-of-concentration'];
    const shard = LOOT_FACTORY['arcane-shard'];
    const crystalIndex = inventory.getItemIndex(shard().id);

    if (crystalIndex === undefined) {
      sandbox.setText('Quest item has not been found');
    } else {
      inventory.destroySlot(crystalIndex);
      inventory.addItem(reward(), 1);
      this.unregisterQuestEvents();
      this.board?.destroy();
      this.board = null;
      this.questMark?.destroy();
      this.questMark = null;

      this.action.events.off('crystal-shrine:looted', this.pickingCrystal, this);
      this.action.events.off('crystal-shrine:completed', this.onAcceptedQuest, this);

      SaveService.setQuestState(QUEST_IDS.CRYSTAL, 'done');
    }
  }
}
