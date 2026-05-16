import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { CrystalShrineQuest } from '@/components/ui/boards/crystal-shrine-quest';
import { QUEST_IDS } from '@/constants/quest-ids';
import { QUEST_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class CrystalShrineQuestTrigger extends Interactable {
  private quest: CrystalShrineQuest;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['crystal-shrine-quest']);
    this.quest = ServiceLocator.resolve(ServiceKeys.ui).getBoard<CrystalShrineQuest>(
      'crystal-shrine-quest'
    );

    this.quest.createQuestMark('crystal-shrine-quest-mark');
    this.quest.defineQuestState(QUEST_IDS.CRYSTAL);
  }

  protected onEnter(): void {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();

    if (player.isQuestActive(QUEST_IDS.CRYSTAL)) {
      return;
    }

    if (this.quest.registerQuestEvents()) {
      this.ui.showHorizontalTooltip(
        {
          x: INTERACT_TOOLTIP.X,
          y: INTERACT_TOOLTIP.Y,
          width: INTERACT_TOOLTIP.WIDTH,
          fillColor: INTERACT_TOOLTIP.FILL_COLOR,
        },
        QUEST_TOOLTIP
      );
    }
  }

  protected onInteract(): void {
    if (!this.quest.isOpen) {
      this.quest.scene.events.emit('open-quest');
      this.ui.hideTooltip();
    }
  }

  protected onLeave(): void {
    if (this.quest.isOpen) {
      this.quest.scene.events.emit('close-quest');
    }
    this.quest.unregisterQuestEvents();
    this.ui.hideTooltip();
  }
}
