import { Quest } from '@/base/ui/quest';
import { UI } from '@/constants/asset-keys';
import { ALCHEMIST_QUEST_TEXT, QUEST_TEXT_WIDTH, textStyle } from '@/constants/board-texts';
import { QUEST_IDS } from '@/constants/quest-ids';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { LevelOneScene } from '@/scenes/level-one-scene';

export class AlchemistQuest extends Quest {
  constructor(scene: Phaser.Scene) {
    super(scene, ALCHEMIST_QUEST_TEXT.NAME);

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
  }

  protected acceptQuest(): void {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const save = ServiceLocator.resolve(ServiceKeys.save);
    if (player.isQuestActive(QUEST_IDS.ALCHEMIST_FIREWORM) === false) {
      player.setQuestStatus(QUEST_IDS.ALCHEMIST_FIREWORM, true);
      SaveService.setQuestState(QUEST_IDS.ALCHEMIST_FIREWORM, 'waiting');
    }

    if (save?.worldState.killedBosses.includes('fire-worm')) {
      (this.action as LevelOneScene).spawnLoot('fireworm-fang-1', { x: 7000, y: 520 - 9 }, [
        { id: 'fireworm-fang', amount: 1 },
      ]);
    } else {
      this.action.events.once(
        'fire-worm:died',
        (this.action as LevelOneScene).onFireWormDied,
        this.action
      );
    }

    this.action.events.once('fireworm-fang:looted', this.onAcceptedQuest, this);
    this.questMark?.changeMarkToWaiting();
  }

  protected completeQuest(): void {
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
      this.questMark?.destroy();
      this.questMark = null;

      this.action.events.off(
        'fire-worm:died',
        (this.action as LevelOneScene).onFireWormDied,
        this.action
      );
      this.action.events.off('fireworm-fang:looted', this.onAcceptedQuest, this);

      SaveService.setQuestState(QUEST_IDS.ALCHEMIST_FIREWORM, 'done');
    }
  }

  protected onAcceptedQuest(): void {
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
    this.questMark?.changeMarkToCompleted();

    SaveService.setQuestState(QUEST_IDS.ALCHEMIST_FIREWORM, 'completed');
  }
}
